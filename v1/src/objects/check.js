const chance = require('chance').Chance();

const MAX_TABLES = 50;
const MAX_TOTAL = 500;

class Check {    
    constructor(connectionPool, restaurantId) {
        this.id = 0;
        this.restaurantId = restaurantId;
        this.tableId = 0;
        this.total = 0;
        this.connectionPool = connectionPool;
    }

    generateMock() {
        this.tableId = chance.integer({ min: 1, max: MAX_TABLES });
        this.total = chance.floating({ min: 0.01, max: MAX_TOTAL, fixed: 2 });
    }

    insert(callback) {
        // Tells async call about current instance
        let _this = this;

        // Async call to the DB
        this.connectionPool.getConnection(function(err, conn) {
            let query = "SET @check_id = 0; ";
            query += "CALL check_insert( " + _this.restaurantId + ", " + 
                        _this.tableId + ", " + _this.total + ", @check_id); ";
            query += "SELECT @check_id; ";

            conn.query(query, function(err, rows){
                if(err) {
                    return callback(err);
                } else {
                    let result = rows[rows.length - 1][0]; 
                    _this.id = result["@check_id"];
                    return callback(null, _this);
                }
            });
        });
    }
}

module.exports = Check;




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

/* TEST CHECK CREATION & INSERTION */

// let pool = mysql.createPool(opts);
// let check = new Check(pool, 11);

// check.generateMock();
// check.insert(function(err, _check) {
//     if(err) {
//         console.log("Exited with error: ", JSON.stringify(err));
//     } else {
//         console.log("Successfully created & inserted new check object: ", 
//                         _check);
//     }
// });