-- migrate:up
ALTER TABLE users ADD password INT NOT NULL;

-- migrate:down
drop table users;
