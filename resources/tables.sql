create table users (
    id int primary key auto_increment,
    email varchar(100) unique not null,
    name varchar(100)
);

create table posts(
    id int primary key auto_increment
    title varchar(50) not null,
    body varchar(200),
    owner_id int,
    foreign key(owner_id) references(id)
)
