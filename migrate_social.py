import sqlite3

# Connect to the database
conn = sqlite3.connect('linear_academy.db') # Assuming running from root
cursor = conn.cursor()

try:
    # Add whatsapp_number column
    try:
        cursor.execute("ALTER TABLE site_config ADD COLUMN whatsapp_number VARCHAR")
        print("Added whatsapp_number column")
    except Exception as e:
        print(f"whatsapp_number error: {e}")

    # Add youtube_url column
    try:
        cursor.execute("ALTER TABLE site_config ADD COLUMN youtube_url VARCHAR")
        print("Added youtube_url column")
    except Exception as e:
        print(f"youtube_url error: {e}")

    conn.commit()
    print("Migration completed")

except Exception as e:
    print(f"Migration failed: {e}")

conn.close()
