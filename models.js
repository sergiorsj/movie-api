const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    ImgPath: String,
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Year: { type: String, required: true },
    Genre: {
      Name: String,
      Description: String
  },
  Director: {
    Name: String,
    Description: String
},
    Featured: Boolean,
  });

  let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthdate: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

  userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };
  userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
  };

  let directorSchema = mongoose.Schema({
    Name: { String },
    Bio: { String },
    Birth: { type: Date },
    Death: { type: Date },
  });

  let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Directors", directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;