-- สร้าง Keyspace
CREATE KEYSPACE IF NOT EXISTS user_profiles
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

-- สร้าง Table roles
CREATE TABLE IF NOT EXISTS user_profiles.roles (
  role_id INT PRIMARY KEY,
  role TEXT,
  description TEXT,
);

-- สร้าง Table users
CREATE TABLE IF NOT EXISTS user_profiles.users (
  user_id UUID PRIMARY KEY,
  username TEXT,
  password TEXT,
  email TEXT,
  role_id INT,
  created_at TIMESTAMP
);

-- สร้าง Index
CREATE INDEX ON user_profiles.users (username);
CREATE INDEX ON user_profiles.users (email);
CREATE INDEX ON user_profiles.users (role_id);
CREATE INDEX ON user_profiles.roles (role);

-- ใส่ข้อมูลทดลอง สำหรับ roles
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (1, 'Intern Developer', 'ฝึกงาน ช่วยงานโปรเจกต์ต่าง ๆ');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (2, 'Junior Developer', 'พัฒนาโค้ดพื้นฐานตามสเปคที่ได้รับ');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (3, 'Developer', 'พัฒนาโค้ดตาม requirement ของทีม');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (4, 'Senior Developer', 'โค้ดระดับสูง ดูแลและช่วยเหลือทีมเล็ก');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (5, 'Tech Lead', 'ดูแลด้านเทคนิคทีม Dev และตัดสินใจเชิงเทคนิค');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (6, 'QA Engineer', 'ทดสอบและประกันคุณภาพซอฟต์แวร์');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (7, 'UI/UX Designer', 'ออกแบบหน้าจอและประสบการณ์ผู้ใช้ที่ดี');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (8, 'Backend Developer', 'พัฒนาและดูแลระบบฝั่งเซิร์ฟเวอร์และฐานข้อมูล');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (9, 'DevOps Engineer', 'ดูแลการ Deploy ระบบ และ Infrastructure');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (10, 'Project Manager', 'วางแผนและบริหารโครงการระหว่างทีม');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (11, 'Product Owner', 'วางแผน Feature และกำหนดทิศทาง Product');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (12, 'CTO', 'ผู้นำด้านเทคโนโลยีของบริษัท ตัดสินใจเชิงกลยุทธ์');

-- ใส่ข้อมูลทดลอง
INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at)
VALUES (uuid(), 'john_doe', 'test1234', 'john@example.com', 1, toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at)
VALUES (uuid(), 'jane_doe', 'test1234', 'jane@example.com', 2, toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at) 
VALUES (uuid(), 'admin', '$2b$10$wYxbz32cXsfbn4bNer7FTO55X4H70r0i5xEQl4aau1k8qYZaEpYpa', 'admin@example.com', 12, toTimestamp(now()));