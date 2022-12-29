-- migrate:up
<<<<<<< HEAD
CREATE TABLE posts(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(2000) NULL,
  post_image VARCHAR(1000) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
=======
create table posts (
  id int not null auto_increment primary key,
  title varchar(255) not null,
  contents varchar(255) not null,
  user_id int not null,
  constraint fk_userId foreign key (user_id) references users(id)
);
>>>>>>> main

-- migrate:down

DROP TABLE posts;