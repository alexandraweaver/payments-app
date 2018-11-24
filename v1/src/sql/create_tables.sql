CREATE TABLE restaurant (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE KEY
);

CREATE TABLE `check` (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    date_modified DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY fk_restaurant_id (restaurant_id) REFERENCES restaurant(id)
);

CREATE TABLE payment (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    check_id INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    credit_card_num CHAR(16),
    date_modified DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY fk_check_id (check_id) REFERENCES `check`(id)
);
