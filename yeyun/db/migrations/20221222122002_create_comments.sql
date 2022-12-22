-- migrate:up
CREATE TABLE comments(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(3000) NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT posts_comments_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id),
  CONSTRAINT users_comments_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

-- migrate:down
DROP TABLE comments;
