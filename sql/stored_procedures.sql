
DROP PROCEDURE IF EXISTS restaurant_insert;
DELIMITER //
CREATE PROCEDURE restaurant_insert (
                                    IN in_restaurant_name VARCHAR(255),
                                    OUT restaurant_id INTEGER)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN 
            SHOW ERRORS;
            ROLLBACK;
        END;
        
    START TRANSACTION;
        INSERT INTO restaurant(`name`) 
        VALUES (in_restaurant_name);
        SET restaurant_id = LAST_INSERT_ID();
    COMMIT;
END//

DELIMITER ;

DROP PROCEDURE IF EXISTS check_insert;
DELIMITER //
CREATE PROCEDURE check_insert (
                                IN in_restaurant_id INTEGER,
                                IN in_table_id INTEGER,
                                IN in_total DECIMAL(12, 2),
                                OUT check_id INTEGER)

BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN 
            SHOW ERRORS;
            ROLLBACK;
        END;
    START TRANSACTION;
        INSERT INTO `check`(restaurant_id, table_id, total) 
        VALUES (in_restaurant_id, in_table_id, in_total);
        SET check_id = LAST_INSERT_ID();
    COMMIT;
END//

DELIMITER ;

DROP PROCEDURE IF EXISTS payment_insert;

DELIMITER //
CREATE PROCEDURE payment_insert (
                                IN in_check_id INTEGER,
                                IN in_amount DECIMAL(12, 2),
                                IN in_credit_card_num CHAR(16),
                                OUT payment_id INTEGER)

BEGIN   
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN 
            SHOW ERRORS;
            ROLLBACK;
        END;
    START TRANSACTION;
        INSERT INTO restaurant(check_id, amount, credit_card_num) 
        VALUES (in_check_id, in_amount, in_credit_card_num);
        SET payment_id = LAST_INSERT_ID();
    COMMIT;
END//

