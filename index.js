const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3000;

// Sample data of top 10 movies
const top10Movies = [
    { title: "Avatar", director: "James Cameron", year: 2009 },
    { title: "Avengers: Endgame", director: "Joss Whedon", year: 2019 },
    { title: "Avatar: The Way of Water", director: "James Cameron", year: 2022 },
    { title: "Titanic", director: "James Cameron", year: 1997 },
    { title: "Star Wars: The Force Awakens", director: "J J Abrams", year: 2015 },
    { title: "Avengers: Infinity War", director: "Anthony Russo", year: 2018 },
    { title: "Spider-Man: No Way Home", director: "Jon Watts", year: 2021 },
    { title: "Jurassic World", director: "Colin Trevorrow", year: 2015 },
    { title: "The Lion King", director: "Jon Favreau", year: 2019 },
    { title: "Furious 7", director: "James Wan", year: 2015 },
];

// Morgan middleware to log all requests to the terminal
app.use(morgan('dev'));

// GET route at "/movies" endpoint
app.get('/movies', (req, res) => {
    res.json(top10Movies);
});

// GET route at "/" endpoint
app.get('/', (req, res) => {
    res.send('Welcome to my movie database!');
});

// Serve static files from the "public" folder
app.use(express.static('public'));

// Error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});