-- migrate:up
create table users (
  id int not null auto_increment primary key,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null
)


-- migrate:down

DROP TABLE users;