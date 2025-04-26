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
  password TEXT,
  email TEXT,
  created_at TIMESTAMP
);

-- สร้าง Index
CREATE INDEX ON user_profiles.users (username);
CREATE INDEX ON user_profiles.users (email);

-- ใส่ข้อมูลทดลอง
INSERT INTO user_profiles.users (user_id, username, password, email, created_at)
VALUES (uuid(), 'john_doe', 'john@example.com', 'test1234', toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, password, email, created_at)
VALUES (uuid(), 'jane_doe', 'jane@example.com', 'test1234', toTimestamp(now()));