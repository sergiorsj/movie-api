const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

const users = [
    { id:'1', fullName: "Jessica Amanda", email: "jamanda@gmail.com", favMovie: "The Lion King"},
    { id:'2', fullName: "Hilda Mirahi", email: "hmirahi@gmail.com", favMovie: "Avatar"},
];

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

app.use(bodyParser.json());

// Morgan middleware to log all requests to the terminal
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Welcome to my movie API');
});

// GET route at "/movies" endpoint
app.get('/top10Movies', (req, res) => {
    res.status(200).json(top10Movies);
});

// Read by title
app.get ('/top10Movies/:title', (req, res) => {
    const {title} = req.params;
    const movie = top10Movies.find(movie => movie.title === title )

    if (movie){
        res.status(200).json(movie);
    }
    else {
        res.status(404).send('Movie Not Found: ( ');
    }
});

// Read by year
app.get('/top10Movies/:title/year', (req, res) => {
    const {title} = req.params;
    const movie = top10Movies.find(movie => movie.title === title )

    if(movie){
        res.status(200).json(movie.year);
    }
    else{
        res.status(404).send('Movie Not Found: ( ');
    }
});

// Read director by title
app.get('/top10Movies/:title/director', (req, res) => {
    const {title} = req.params;
    const movie = top10Movies.find(movie => movie.title === title )

    if(movie){
        res.status(200).json(movie.director);
    }
    else{
        res.status(404).send('Movie Not Found: ( ');
    }
});

// Read docx
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});

//Create new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    if(newUser.fullname){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    }
    else{
        res.status(400).send('User Needs Name');
    }
});

//Update user info
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
  
    let user = users.find( user => user.id == id );
  
    if(user){
        user = {
          user: user.id,
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          favMovie: user.favMovie
        };
        res.status(200).json(user);
    }
    else{
        res.status(400).send('Not a Registered User');
    }
  });

  //Update users favMovie
app.post('/users/:id/:title', (req, res) => {
    const { id , title } = req.params;
  
    let user = users.find( user => user.id == id );
    let newTitle = {
      title,
      director: req.body.director,
      year: req.body.year
    };
    
    if(user){
        user.favMovie.push(newTitle);
        res.status(200).send('user\'s favorite movies have been updated');
    }
    else{
        res.status(400).send('could not update favorite movies');
    }
    console.log(JSON.stringify(user.favMovie));
  });

  //Delete a favorite movie
app.delete('/users/:id/:title', (req, res) => {
  const { id , title } = req.params;
  let user = users.find( user => user.id == id );

  if(user){
    user = user.favMovie.filter( m => m.title !== title)
    res.status(200).send('user\'s favorite movies have been updated');
  }
  else{
      res.status(400).send('could not update favorite movies');
  }
  console.log(JSON.stringify(user));
});

// Delete a user
app.delete('/users/:id/', (req, res) => {
  const {id} = req.params;
  let user = users.find( user => user.id == id );

  if(user){
    users = users.filter( user => user.id !== id)
    console.log(users);
    res.status(200).send('user has been deleted');
  }
  else{
      res.status(400).send('could not update user');
  }
  
});

// Start the server
app.listen(8080, () => {
    console.log(`Server is running on 8080`);
});