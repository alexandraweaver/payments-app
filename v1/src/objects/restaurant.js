const chance = require('chance').Chance();

class Restaurant {
    constructor(connectionPool) {
        this.id = 0;
        this.name = "";
        this.connectionPool = connectionPool;
    }

    generateMock() {
        this.name = chance.company();
    }

    insert(callback) {
        // Tells async call about current instance
        let _this = this;

        // Async call to the DB
        this.connectionPool.getConnection(function(err, conn) {
            let query = "SET @restaurant_id = 0; ";
            query += "CALL restaurant_insert( '" + _this.name + "', @restaurant_id); ";
            query += "SELECT @restaurant_id; ";

            conn.query(query, function(err, rows){
                if(err) {
                    return callback(err);
                } else {
                    let result = rows[rows.length - 1][0]; 
                    _this.id = result["@restaurant_id"];
                    return callback(null, _this);
                }
            });
        });
    }

    static getRandId(connectionPool, callback) {
        // Async call to the DB
        connectionPool.getConnection(function(err, conn) {
            let query = "SELECT id AS rand_id FROM restaurant ORDER BY RAND() LIMIT 1 ";

            conn.query(query, function(err, rows){
                if(err) {
                    return callback(err);
                } else {
                    let result = rows[0]["rand_id"]; 
                    return callback(null, result);
                }
            });
        });
    }
}


module.exports = Restaurant;


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


/* TEST Restaurant.getRandId(connectionPool, callback) */
// let pool = mysql.createPool(opts);

// Restaurant.getRandId(pool, function (err, result) {
//     if(err) {
//         console.log("Finished testing Restaurant.getRandId() with error: ", err);
//     } else {
//         console.log("Finished testing Restaurant.getRandId() with result: ", result);
//     }
// });


/* TEST RESTAURANT CREATION & INSERTION */
// let restaurant = new Restaurant(pool);

// restaurant.generateMock();
// restaurant.insert(function(err, _restaurant) {
//     if(err) {
//         console.log("Exited with error: ", JSON.stringify(err));
//     } else {
//         console.log("Successfully created & inserted new restaurant object: ", 
//                         _restaurant);
//     }
// });