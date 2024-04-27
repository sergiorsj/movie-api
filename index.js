const http = require('http');
const url = require('url');
const fs = require('fs');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
mongoose.connect('mongodb://localhost:27017/dbname', { useNewUrlParser: true, useUnifiedTopology: true });

const server = http.createServer((request, response) => {
    // Log the request URL and timestamp
    const logData = `${new Date().toISOString()} - ${request.url}\n`;
    fs.appendFile('./log.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    // Parse the URL
    const parsedUrl = url.parse(request.url, true);

    // Extract the pathname from the URL
    const pathname = parsedUrl.pathname;

    // Check if the URL contains the word "documentation"
    if (pathname.includes('documentation')) {
        // Serve the documentation.html file
        fs.readFile('./documentation.html', (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal Server Error');
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    } else {
        // Serve the index.html file
        fs.readFile('./index.html', (err, data) => {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end('Internal Server Error');
                return;
            }
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});