-- migrate:up
<<<<<<< HEAD
CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  profile_image VARCHAR(1000) DEFAULT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT users_ukey UNIQUE (email)
=======
create table users (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null
>>>>>>> main
)


-- migrate:down

DROP TABLE users;