-- migrate:up
ALTER TABLE users add user_name VARCHAR(100) NULL;

-- migrate:down
DROP TABLE users;
