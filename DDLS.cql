-- สร้าง Keyspace
CREATE KEYSPACE IF NOT EXISTS user_profiles
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

-- สร้าง Table users
CREATE TABLE IF NOT EXISTS user_profiles.users (
  user_id UUID PRIMARY KEY,
  username TEXT,
  email TEXT,
  created_at TIMESTAMP
);

-- ใส่ข้อมูลทดลอง
INSERT INTO user_profiles.users (user_id, username, email, created_at)
VALUES (uuid(), 'john_doe', 'john@example.com', toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, email, created_at)
VALUES (uuid(), 'jane_doe', 'jane@example.com', toTimestamp(now()));