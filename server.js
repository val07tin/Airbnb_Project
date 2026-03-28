// server.js - The Backend
require('dotenv').config(); 
console.log('DB_HOST:', process.env.DB_HOST);

const express = require('express');
const mysql = require('mysql2');
const app = express();

const path = require('path');

app.use(express.static('public'));


// Set up the view engine (EJS) to display HTML
app.set('view engine', 'ejs');

// 2. Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    multipleStatements: true //Allows running multiple queries at once
})

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// 3. The Main Route (Homepage)
app.get('/', (req, res) => {
    
    const sqlQueries = `
        /* Q1: Superhost vs Price */
        SELECT h.is_superhost, AVG(l.price) AS average_price
        FROM Host h JOIN Listing l ON h.host_id = l.host_id GROUP BY h.is_superhost;

        /* Q2: Price by Neighbourhood */
        SELECT n.neighbourhood_name, AVG(l.price) AS average_price FROM Listing l JOIN Neighbourhood n ON l.neighbourhood_id = n.neighbourhood_id
        GROUP BY n.neighbourhood_name ORDER BY FIELD(n.neighbourhood_name, 'FIRST WARD','SECOND WARD','THIRD WARD','FOURTH WARD','FIFTH WARD',
        'SIXTH WARD','SEVENTH WARD','EIGHTH WARD','NINTH WARD','TENTH WARD', 'ELEVENTH WARD','TWELFTH WARD','THIRTEENTH WARD','FOURTEENTH WARD','FIFTEENTH WARD');

        /* Q3: Review vs Price */
        SELECT AVG(r.review_score) AS avg_review_score, AVG(l.price) AS avg_price
        FROM Review r JOIN Listing l ON r.listing_id = l.listing_id;

        /* Q4: TOP Multi-listing Hosts */
        SELECT h.host_name, COUNT(l.listing_id) AS number_of_listings FROM Host h JOIN Listing l ON h.host_id = l.host_id GROUP BY h.host_id, h.host_name
        HAVING COUNT(l.listing_id) > 1 ORDER BY number_of_listings DESC LIMIT 5;

        /* Q5: Room Type vs Price */
        SELECT room_type, AVG(price) AS average_price FROM Listing GROUP BY room_type;

        /* Q6: Best Value Listings */
        SELECT DISTINCT h.host_name, n.neighbourhood_name, l.room_type, l.price, r.review_score FROM host h JOIN Listing l ON h.host_id = l.host_id
        JOIN neighbourhood n ON l.neighbourhood_id = n.neighbourhood_id JOIN review r ON l.listing_id = r.listing_id 
        WHERE r.review_score > 4 AND l.price < (SELECT AVG(price) FROM listing) ORDER BY r.review_score DESC, l.price ASC LIMIT 4;
    `;

    db.query(sqlQueries, (err, results) => {
        if (err) throw err;
        
        // Render the HTML page and send the data (results) to it
        res.render('index', { 
            q1: results[0], 
            q2: results[1], 
            q3: results[2], 
            q4: results[3], 
            q5: results[4],
            q6: results[5]
        });
    });
});

//  Start the Server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
