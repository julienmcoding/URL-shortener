create database shorturl;

create table shortURL (
    id SERIAL PRIMARY KEY,
    original_url text unique
);