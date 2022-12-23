-- migrate:up
CREATE TABLE posts(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(3000) NULL,
  user_id INT NOT NULL
);

-- migrate:down
DROP TABLE posts;