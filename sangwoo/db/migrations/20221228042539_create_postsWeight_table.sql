-- migrate:up
ALTER TABLE posts add posting_title VARCHAR(300) NOT NULL;

-- migrate:down
DROP TABLE posts;
