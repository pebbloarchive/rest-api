create table if not exists users (
    id bigint not null primary key,
    username varchar(24) not null unique,
    name varchar(100) default '',
    avatar varchar(80) default '',
    password varchar(200) not null,
    vanity varchar(24) default '' unique,
    email varchar(128) not null unique,
    verified_email bool unique,
    bio varchar(500) default '',
    email_code varchar(500) default '',
    created_at date not null default current_date,
    updated_at date not null default current_date,
    verified_at date not null default current_date,
    admin bool default false,
    mod bool default false,
    suspended bool default false,
    suspended_date date not null default current_date,
    mfa bool default false,
    mfa_backup text [] default []
)

create table if not exists posts (
    id bigint not null primary key,
    author bigint not null,
    content varchar(1500) not null,
    attachments text [] not null,
    likes text [] not null,
    created_at date not null default current_date,
    updated_at date not null default current_date,
)

create table if not exists following (
    sender bigint not null references users(id)
    recipient bigint NOT null references users(id),
    following bool not null default false,
    primary key (sender, recipient)
)

create table if not exists followers (
    user_id bigint not null references users(id),
    following_id bigint not null references users(id),
    primary key (user_id, following_id)
);

create table if not exists blocked (
    user_id bigint not null references users(id),
    blacklisted_id bigint not null references users(id),
    primary key (user_id, blacklisted_id)
);

    -- following text [] default [],
    -- followers text [] default [],
    -- blocked text [] default [],