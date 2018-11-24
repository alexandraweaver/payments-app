
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

// this.restaurant_id = chance.integer({ min: 1, max: Restaurant.getMaxID(this.connectionPool, this.restaurant_id) });
