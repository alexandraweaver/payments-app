const chance = require('chance').Chance();

class Payment {    
    constructor(connectionPool, checkId, amount, creditCardNum) {
        this.id = 0;
        this.checkId = checkId;
        this.amount = amount;
        this.creditCardNum = creditCardNum;
        this.connectionPool = connectionPool;
    }

    insert(callback) {
        // Tells async call about current instance
        let _this = this;

        // Async call to the DB
        this.connectionPool.getConnection(function(err, conn) {
            let query = "SET @payment_id = 0; ";
            query += "CALL payment_insert( " + _this.checkId + ", " + 
                        _this.amount + ", '" + _this.crediCardNum + "', @payment_id); ";
            query += "SELECT @payment_id; ";

            conn.query(query, function(err, rows){
                if(err) {
                    return callback(err);
                } else {
                    let result = rows[rows.length - 1][0]; 
                    _this.id = result["@payment_id"];
                    return callback(null, _this);
                }
            });
        });
    }
}

module.exports = Payment;




/* TEST CODE */
// const mysql = require('mysql2');

// const opts = {
//     host: "localhost",
//     user: "root",
//     password: "mysql",
//     port: 3307,
//     database: "payments",
//     multipleStatements: true
// };


/* TEST PAYMENT CREATION & INSERTION */

// let pool = mysql.createPool(opts);

// let payment = new Payment(pool, 1, 100, '1234567890123456');

// payment.insert(function(err, _payment) {
//     if(err) {
//         console.log("Exited with error: ", JSON.stringify(err));
//     } else {
//         console.log("Successfully created & inserted new payment object: ", 
//                         _payment);
//     }
// });