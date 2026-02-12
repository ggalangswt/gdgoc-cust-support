import sqlite3
import bcrypt

# Connect to database
conn = sqlite3.connect('customer_support.db')
cursor = conn.cursor()

# Get agent user
cursor.execute("SELECT email, hashed_password FROM users WHERE email='agent@example.com'")
result = cursor.fetchone()

if result:
    email, hashed_password = result
    print(f"Email: {email}")
    print(f"Hash: {hashed_password[:60]}...")
    
    # Test password verification
    plain_password = "password123"
    
    try:
        is_valid = bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
        print(f"\n✓ Password verification: {is_valid}")
    except Exception as e:
        print(f"\n✗ Error: {e}")
else:
    print("User not found")

conn.close()
