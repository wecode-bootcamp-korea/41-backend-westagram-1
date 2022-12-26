-- migrate:up
create table posts (
  id int not null auto_increment primary key,
  title varchar(255) not null,
  contents varchar(255) not null,
  user_id int not null,
  constraint fk_userId foreign key (user_id) references users(id)
);

-- migrate:down

DROP TABLE posts;