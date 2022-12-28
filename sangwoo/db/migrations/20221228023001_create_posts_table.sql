-- migrate:up
ALTER TABLE posts add user_id INT NOT NULL;

-- migrate:down
DROP TABLE posts;
