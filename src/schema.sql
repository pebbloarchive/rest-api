CREATE TABLE IF NOT EXISTS "users" (
    id varchar(200) not null primary key,
    username varchar(24) not null,
    name varchar(100) default '',
    avatar varchar(80) default '',
    password varchar(200) not null,
    vanity varchar(24) default '',
    email varchar(128) not null,
    is_verified bool,
    is_private bool,
    verified_email bool,
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
    mfa_backup text []
);

CREATE TABLE IF NOT EXISTS "posts" (
    id varchar(200) not null primary key,
    author varchar(500) not null,
    content varchar(1500) not null,
    attachments text [] not null,
    likes text [] not null,
    created_at date not null default current_date,
    updated_at date not null default current_date
);
