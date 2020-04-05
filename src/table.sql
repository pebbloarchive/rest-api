CREATE TABLE IF NOT EXISTS "following" (
    sender varchar(500) not null references users(id),
    recipient varchar(500) NOT null references users(id),
    following bool not null default false,
    primary key (sender, recipient)
);

CREATE TABLE IF NOT EXISTS "followers" (
    user_id varchar(500) not null references users(id),
    following_id varchar(500) not null references users(id),
    primary key (user_id, following_id)
);

CREATE TABLE IF NOT EXISTS "blocked" (
    user_id varchar(500) not null references users(id),
    blacklisted_id varchar(500) not null references users(id),
    primary key (user_id, blacklisted_id)
);