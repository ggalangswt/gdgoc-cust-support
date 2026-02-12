import sqlite3
import bcrypt
from datetime import datetime

# Connect to database
conn = sqlite3.connect('customer_support.db')
cursor = conn.cursor()

# Demo users
demo_users = [
    {
        "email": "agent@example.com",
        "username": "agent_user",
        "full_name": "Support Agent",
        "password": "password123",
        "role": "agent"
    },
    {
        "email": "customer@example.com",
        "username": "customer_user",
        "full_name": "John Customer",
        "password": "customer123",
        "role": "customer"
    },
    {
        "email": "admin@example.com",
        "username": "admin_user",
        "full_name": "System Admin",
        "password": "admin123",
        "role": "admin"
    }
]

# Delete existing users first
cursor.execute("DELETE FROM users")

# Insert demo users
for user in demo_users:
    # Hash password using bcrypt directly
    password_bytes = user["password"].encode('utf-8')
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute(
        """
        INSERT INTO users (email, username, full_name, hashed_password, role, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["email"],
            user["username"],
            user["full_name"],
            hashed_password,
            user["role"],
            True,
            datetime.utcnow().isoformat()
        )
    )
    print(f"✓ Created user: {user['email']} / {user['password']}")

conn.commit()
conn.close()

print("\n✅ Demo users created successfully!")
print("\nYou can now login with:")
print("  Agent: agent@example.com / password123")
print("  Customer: customer@example.com / customer123")
print("  Admin: admin@example.com / admin123")
