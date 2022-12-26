-- migrate:up
create table users_test (
  id int not null auto_increment,
  name varchar(255) not null,
  email varchar(255) not null,
  password varchar(255) not null,
  primary key (id)
)

-- migrate:down

drop table users_test  