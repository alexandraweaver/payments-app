/* LIBRARY IMPORTS */
// const aysnc = require('aysnc');
const async = require('async');
const mysql = require('mysql2');
const chance = require('chance').Chance();

/* OBJECT IMPORTS */
const Restaurant = require('./v1/src/objects/restaurant');
const Check = require('./v1/src/objects/check');
const Payment = require('./v1/src/objects/payment');


const opts = {
    host: "localhost",
    user: "root",
    password: "mysql",
    port: 3307,
    database: "payments",
    multipleStatements: true
};

let pool = mysql.createPool(opts);


async.parallel([
    function(callback) {
        async.forever(
            function(next) {
                /* TEST RESTAURANT CREATION & INSERTION */
                let restaurant = new Restaurant(pool);

                restaurant.generateMock();
                restaurant.insert(function(err, _restaurant) {
                    if(err) {
                        return next(err);
                    } else {
                        console.log("Successfully created restaurant: ", _restaurant);
                        return next();
                    }
                });
            },
            function(err) {
                return callback(err);
            }
        );
    },
    function(callback) {
        async.forever(
            function(next) {
                async.waterfall([
                    function(callback) {
                        Restaurant.getRandId(pool, function (err, _restaurantId) {
                            if(err) {
                                return callback(err);
                            } else {
                                return callback(null, _restaurantId);                            
                            }
                        });
                    },
                    // Result from above is passed as restaurantId
                    function(restaurantId, callback) {
                        let check = new Check(pool, restaurantId);

                        check.generateMock();
                        check.insert(function(err, _check) {
                            if(err) {
                                return callback(err);                            
                            } else {
                                console.log("Successfully created check: ", _check);
                                return callback(null, _check);  
                            }
                        });
                    },
                    function(check, callback) {
                        let payment = new Payment(pool, check.id, check.total, chance.cc());

                        payment.insert(function(err, _payment) {
                            if(err) {
                                return callback(err);                            
                            } else {
                                console.log("Successfully created payment: ", _payment);
                                return callback(null, _payment);  
                            }
                        });
                    }
                ], function (err, payment) {
                        if(err) {
                            return next(err);
                        } else {
                            return next();
                        }
                    });
            },
            function(err) {
                return callback(err);
            }
        );
    }
], function(err, results) {
    if(err) {
        console.log("Exited with error: ", JSON.stringify(err));
    } else {
        console.log("Results: ", results);
    }
});