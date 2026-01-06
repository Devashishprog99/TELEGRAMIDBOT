import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User, ChevronRight, Search } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://welldecked-deflected-daniella.ngrok-free.dev';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE}/admin/users`);
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
        (u.telegram_id.toString().includes(search)) ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div className="text-center text-gray-400 py-10">Loading users...</div>;

    return (
        <div className="space-y-6 animate-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-gray-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.map(user => (
                    <Link
                        key={user.id}
                        to={`/users/${user.id}`}
                        className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">{user.full_name}</h3>
                                <p className="text-sm text-gray-400">@{user.username || 'N/A'} • {user.telegram_id}</p>
                            </div>
                        </div>
                        <div className="text-right flex items-center space-x-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Balance</p>
                                <p className="text-lg font-bold text-green-400">₹{user.balance.toFixed(2)}</p>
                            </div>
                            <ChevronRight className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                    </Link>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No users found matching "{search}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
