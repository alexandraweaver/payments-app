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
}




// Goes in app.js in future

const mysql = require('mysql2');

const opts = {
    host: "localhost",
    user: "root",
    password: "mysql",
    port: 3307,
    database: "payments",
    multipleStatements: true
};

let pool = mysql.createPool(opts);

let restaurant = new Restaurant(pool);

restaurant.generateMock();
restaurant.insert(function(err, _restaurant) {
    if(err) {
        console.log("Exited with error: ", JSON.stringify(err));
    } else {
        console.log("Successfully created & inserted new restaurant object: ", 
                        _restaurant);
    }
});