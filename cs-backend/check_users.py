import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Connect to database
conn = sqlite3.connect('customer_support.db')
cursor = conn.cursor()

# Get all users
cursor.execute("SELECT id, email, username, hashed_password, role FROM users")
users = cursor.fetchall()

print("=== USERS IN DATABASE ===")
for user in users:
    print(f"\nID: {user[0]}")
    print(f"Email: {user[1]}")
    print(f"Username: {user[2]}")
    print(f"Password Hash: {user[3][:50]}...")
    print(f"Role: {user[4]}")
    
    # Test password verification
    test_passwords = {
        "agent@example.com": "password123",
        "customer@example.com": "customer123",
        "admin@example.com": "admin123"
    }
    
    if user[1] in test_passwords:
        is_valid = pwd_context.verify(test_passwords[user[1]], user[3])
        print(f"Password '{test_passwords[user[1]]}' valid: {is_valid}")

conn.close()
