-- migrate:up
CREATE TABLE comment (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(3000) NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT comment_user_fk FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT comment_post_fk FOREIGN KEY (post_id) REFERENCES posts(id)

)

-- migrate:down
DROP TABLE comment;