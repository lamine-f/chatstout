create table users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL

);

create table messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value TEXT,
    to_login VARCHAR(255) NOT NULL,
    FOREIGN KEY (to_login) REFERENCES users(login)
);