import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Upload, CreditCard, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://welldecked-deflected-daniella.ngrok-free.dev';

export default function PaymentSettings() {
    const [settings, setSettings] = useState({ upi_id: '', qr_image: null });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_BASE}/admin/settings/payment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSaveUpi = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(
                `${API_BASE}/admin/settings/payment`,
                { upi_id: settings.upi_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'UPI ID updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update UPI ID' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.post(
                `${API_BASE}/admin/settings/qr`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            if (data.success) {
                setSettings(prev => ({ ...prev, qr_image: data.path }));
                setMessage({ type: 'success', text: 'QR Code uploaded successfully!' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload QR Code' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-8 h-8 text-blue-500" />
                Payment Settings
            </h2>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* UPI ID Section */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg">UPI</span>
                    UPI Configuration
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Merchant UPI ID</label>
                        <input
                            type="text"
                            value={settings.upi_id}
                            onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                            placeholder="e.g. merchant@upi"
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <p className="text-gray-500 text-sm mt-2">
                            This ID will be used to generate dynamic QR codes for user deposits.
                        </p>
                    </div>

                    <button
                        onClick={handleSaveUpi}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save UPI ID'}
                    </button>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-purple-400" />
                    Custom QR Code
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                            Upload a static QR code image. If uploaded, this image will be shown to users
                            <b> INSTEAD</b> of the dynamic UPI QR.
                        </p>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="qr-upload"
                            />
                            <label
                                htmlFor="qr-upload"
                                className="cursor-pointer bg-gray-900 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center transition-all group"
                            >
                                <Upload className="w-8 h-8 text-gray-500 group-hover:text-blue-500 mb-2 transition-colors" />
                                <span className="text-gray-400 group-hover:text-white transition-colors">
                                    Click to upload new QR
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                        {settings.qr_image ? (
                            <>
                                <p className="text-gray-400 text-sm mb-4">Current Active QR</p>
                                <img
                                    src={`${API_BASE}/${settings.qr_image}`}
                                    alt="Payment QR"
                                    className="max-w-[200px] rounded-lg border border-gray-600"
                                />
                            </>
                        ) : (
                            <div className="text-center text-gray-500">
                                <QrCode className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>No custom QR uploaded</p>
                                <p className="text-xs text-blue-400 mt-2">Using Dynamic UPI QR</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
