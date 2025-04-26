-- Create Keyspace
CREATE KEYSPACE IF NOT EXISTS user_profiles
WITH replication = {
  'class': 'SimpleStrategy',
  'replication_factor': 1
};

-- Create Table roles
CREATE TABLE IF NOT EXISTS user_profiles.roles (
  role_id INT PRIMARY KEY,
  role TEXT,
  description TEXT,
);

-- Create Table users
CREATE TABLE IF NOT EXISTS user_profiles.users (
  user_id UUID PRIMARY KEY,
  username TEXT,
  password TEXT,
  email TEXT,
  role_id INT,
  created_at TIMESTAMP
);

-- Create Indexes
CREATE INDEX ON user_profiles.users (username);
CREATE INDEX ON user_profiles.users (email);
CREATE INDEX ON user_profiles.users (role_id);
CREATE INDEX ON user_profiles.roles (role);

-- Sample data for roles
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (1, 'Intern Developer', 'Intern, assists with various projects');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (2, 'Junior Developer', 'Develops basic code according to given specs');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (3, 'Developer', 'Develops code according to team requirements');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (4, 'Senior Developer', 'Advanced coding, mentors and assists small teams');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (5, 'Tech Lead', 'Leads Dev team technically and makes technical decisions');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (6, 'QA Engineer', 'Tests and assures software quality');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (7, 'UI/UX Designer', 'Designs user interfaces and good user experiences');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (8, 'Backend Developer', 'Develops and maintains server-side and database systems');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (9, 'DevOps Engineer', 'Handles system deployment and infrastructure');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (10, 'Project Manager', 'Plans and manages projects across teams');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (11, 'Product Owner', 'Plans features and sets product direction');
INSERT INTO user_profiles.roles (role_id, role, description) VALUES (12, 'CTO', 'Company technology leader, makes strategic decisions');

-- Sample data for users
INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at)
VALUES (uuid(), 'john_doe', 'test1234', 'john@example.com', 1, toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at)
VALUES (uuid(), 'jane_doe', 'test1234', 'jane@example.com', 2, toTimestamp(now()));

INSERT INTO user_profiles.users (user_id, username, password, email, role_id, created_at) 
VALUES (uuid(), 'admin', '$2b$10$wYxbz32cXsfbn4bNer7FTO55X4H70r0i5xEQl4aau1k8qYZaEpYpa', 'admin@example.com', 12, toTimestamp(now()));