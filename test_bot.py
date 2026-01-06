import asyncio
import os
from aiogram import Bot, Dispatcher
from dotenv import load_dotenv

load_dotenv()

async def main():
    token = os.getenv("BOT_TOKEN")
    print(f"Testing bot with token: {token[:10]}...")
    bot = Bot(token=token)
    try:
        me = await bot.get_me()
        print(f"Bot connected! ID: {me.id}, Username: {me.username}")
    except Exception as e:
        print(f"Failed to connect: {e}")
    finally:
        await bot.session.close()

if __name__ == "__main__":
    asyncio.run(main())
