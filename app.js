require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const {
  v4: uuidv4
} = require('uuid'); // uuid, To call: uuidv4();
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const helmet = require('helmet');
var fs = require('file-system');
const fileUpload = require('express-fileupload');

const Nepti = require('./models/nepti');
const User = require('./models/user');

const homeRouter = require('./controllers/home');
const citeRouter = require('./controllers/cite-us');
const contactRouter = require('./controllers/contact-us');
const searchRouter = require('./controllers/search');
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const notFund404Router = require('./controllers/404');
const notFund404_adminRouter = require('./controllers/404-admin');

const app = express();
app.use(helmet());

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("models"));
app.use(express.static("assets"));

app.use("/", homeRouter);
app.use("/cite-us", citeRouter);
app.use("/contact-us", contactRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/404", notFund404Router);
app.use("/404-admin", notFund404_adminRouter);
app.use("/s-all-species", searchRouter);
app.use("/s-cultivated-plants", searchRouter);
// app.use("/s-forest-plants", searchRouter);

app.use(fileUpload());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  genid: function(req) {
    return uuidv4();
  },
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false
  } // 1 hour
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.post("/register", (req, res) => {
//
//   User.findOne({
//     username: req.body.username
//   }, function(err, user) {
//     if (err) {
//       console.log(err);
//     }
//     if (user) {
//       console.log("User exists");
//       res.redirect("/register");
//     } else {
//       User.register({
//         username: req.body.username,
//         role: "user"
//       }, req.body.password, function(err, user) {
//         if (err) {
//           console.log(err);
//           res.redirect("/register");
//         } else {
//           passport.authenticate("local")(req, res, function() {
//             res.redirect("/all-records");
//           });
//         }
//       });
//     }
//   });
//
// });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

//-----------pagal URL / atvaizduoja search.ejs --------
app.get("/search-all-species", (req, res) => {

  Nepti.find({},
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
      var allSpecies=[];
      for(i=0; i<neptis.length; i++)
      {
      allSpecies.push(neptis[i].species);
      //console.log(allSpecies[i]);
      }
      res.render("s-all-species", {
        dataArray: JSON.stringify(allSpecies)
      });
    }
  });
});
app.get("/search-cultivated-plants", (req, res) => {

  let defaultClassifier = "Kultūriniai augalai";
  Nepti.find({
    classifier: defaultClassifier
  },
  function(err, neptis) {
    if (err) {
      console.log(err);
    } else {
      var allSpecies=[];
      for(i=0; i<neptis.length; i++)
      {
      allSpecies.push(neptis[i].species);
       //console.log(allSpecies[i]);
      }
      res.render("s-cultivated-plants", {
        dataArray: JSON.stringify(allSpecies)
      });
    }
  });
});
// app.get("/search-forest-plants", (req, res) => {
//   let defaultClassifier = "Forest plants";
//   Nepti.find({
//     classifier: defaultClassifier
//   },
//   function(err, neptis) {
//     if (err) {
//       console.log(err);
//     } else {
//       var allSpecies=[];
//       for(i=0; i<neptis.length; i++)
//       {
//       allSpecies.push(neptis[i].species);
//       // console.log(allSpecies[i]);
//       }
//       res.render("s-forest-plants", {
//         dataArray: JSON.stringify(allSpecies)
//       });
//     }
//   });
// });

//------------Randu ir isvedu visus irasus esancius DB--------
app.get("/database", (req, res) => {

  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          Nepti.find({}, function(err, neptis) {
            if (err) {
              console.log(err);
            } else {
              console.log("Turi isvesti rezultatus");
              res.render("database", {
                neptis: neptis
              });
            }
          });
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/create", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          res.render("create");
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/edit", (req, res) => {

  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          Nepti.find({}, function(err, neptis) {
            if (err) {
              console.log(err);
            } else {
              res.render("edit", {
                neptis: neptis
              });
            }
          });
        } else {

          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/delete", function(req, res) {

  Nepti.deleteOne({
      _id: req.body.deleteById
    },
    function(err) {
      if (!err) {
        res.redirect("/database");
      } else {
        res.send(err);
      }
    }
  );
});

app.get("/edit/:neptiId", (req, res) => {
  //console.log("neptiID");
  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
          const requestedId = req.params.neptiId;
          if (requestedId.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.

            Nepti.findById((requestedId), function(err, nepti) {
              if (err) {
                console.log("error");
                console.log(err);
                res.redirect("/404-admin");
              } else {
                res.render("edit-one", {
                  nepti: nepti
                });
              }
            });
          } else {
            res.redirect("/404-admin");
          }
        } else {
          console.log("User role unknown");
          res.redirect("/404-user");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

//---------Log In-------
app.post("/login", (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // to log in and authenticate it. login Method comes from passport
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", {
        failureRedirect: '/login'
      })(req, res, function() {

        User.findById(req.user.id, function(err, foundUser) {
          if (err) {
            console.log("Error...");
            console.log(err);
          } else {
            if (foundUser.role === "admin") {
              res.redirect("/database");
            } else {
              console.log("User role unknown");
              res.redirect("/");
            }
          }
        });
      });
    }
  });
});

//------------create.ejs formoj ivedu nauja irasa ir nukreipiu i /database--------
app.post("/create", (req, res) => {

  let uploadPath;
  let filePath;
  let sampleFile;

  // if (!req.files || Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }
  if (!req.files || Object.keys(req.files).length === 0) {
    filePath = "No image to show";
  }
  else {
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/uploads/images/' + sampleFile.name;
    filePath = 'images/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);

      //res.send('File uploaded!');
    });
  }

  const nepti = new Nepti({
    classifier: req.body.classifier,
    species: req.body.species,
    augaloSeima: req.body.augaloSeima,
    augaloGentis: req.body.augaloGentis,
    pazeistaAugaloDalis: req.body.pazeistaAugaloDalis,
    minosMorfologTipas: req.body.minosMorfologTipas,
    minosVingiuotumas: req.body.minosVingiuotumas,
    minosTakoUzpildymas: req.body.minosTakoUzpildymas,
    minosPradzia: req.body.minosPradzia,
    ekskrementIssidestymas: req.body.ekskrementIssidestymas,
    ekskrementSpalva: req.body.ekskrementSpalva,
    viksroSpalva: req.body.viksroSpalva,
    filepath: filePath
  });

  nepti.save(function(err) {
    if (!err) {
      console.log("Succesfully created");
      res.redirect("/database");
    }
  });
});

app.post("/update", (req, res) => {

  let uploadPath;
  let filePath;
  let newImageFile;

  if (!req.files || Object.keys(req.files).length === 0) {

  } else {
    newImageFile = req.files.newImageFile;
    uploadPath = __dirname + '/uploads/images/' + newImageFile.name;
    filePath = 'images/' + newImageFile.name;

    newImageFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
    });
  }

  Nepti.findById(req.body.id, function(err, foundNepti) {
    if (err) {
      console.log("Error...");
      console.log(err);
    } else {
      if (foundNepti) {
        foundNepti.species = req.body.species,
        foundNepti.classifier = req.body.classifier

        if (filePath != null) {
          foundNepti.filepath = filePath
        }
        if (req.body.augaloSeima != null) {
          foundNepti.augaloSeima = req.body.augaloSeima
        }
        if (req.body.augaloGentis != null) {
          foundNepti.augaloGentis = req.body.augaloGentis
        }
        if (req.body.pazeistaAugaloDalis != null) {
          foundNepti.pazeistaAugaloDalis = req.body.pazeistaAugaloDalis
        }
        if (req.body.minosMorfologTipas != null) {
          foundNepti.minosMorfologTipas = req.body.minosMorfologTipas
        }
        if (req.body.minosVingiuotumas != null) {
          foundNepti.minosVingiuotumas = req.body.minosVingiuotumas
        }
        if (req.body.minosTakoUzpildymas != null) {
          foundNepti.minosTakoUzpildymas = req.body.minosTakoUzpildymas
        }
        if (req.body.minosPradzia != null) {
          foundNepti.minosPradzia = req.body.minosPradzia
        }
        if (req.body.ekskrementIssidestymas != null) {
          foundNepti.ekskrementIssidestymas = req.body.ekskrementIssidestymas
        }
        if (req.body.ekskrementSpalva != null) {
          foundNepti.ekskrementSpalva = req.body.ekskrementSpalva
        }
        if (req.body.viksroSpalva != null) {
          foundNepti.viksroSpalva = req.body.viksroSpalva
        }

        foundNepti.save(function(err) {
          if (!err) {
            console.log("Succesfully  updated");
            res.redirect("/database");
          }
        });
      } else {
        console.log("Nepti does'f found");
      }
    }
  });
});

// app.post('/upload', function(req, res) {
//
//   let sampleFile;
//   let uploadPath;
//
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   sampleFile = req.files.sampleFile;
//   uploadPath = __dirname + '/uploads/images/' + sampleFile.name;
//
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv(uploadPath, function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//     //res.send('File uploaded!');
//   });
//
// });

app.get("/morphology-guide", function(req, res) {
  var pdfPath = "/uploads/MORPHOLOGY_GUIDE.pdf";

  fs.readFile(__dirname + pdfPath, function(err, pdfData) {
    res.contentType("application/pdf");
    res.send(pdfData);
  });
});

app.use('/*/*', (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
        res.render("404-admin");
      } else if (foundUser.role === "user"){
          res.render("404-user");
        } else {
          console.log("User role unknown");
          res.redirect("/404");
        }
      }
    });
  } else {
    res.render("404");
  }
});

app.use('*', (req, res) => {
  if (req.isAuthenticated()) {

    User.findById(req.user.id, function(err, foundUser) {
      if (err) {
        console.log("Error...");
        console.log(err);
      } else {
        if (foundUser.role === "admin") {
        res.render("404-admin");
      } else if (foundUser.role === "user"){
          res.render("404-user");
        } else {
          console.log("User role unknown");
          res.redirect("/404");
        }
      }
    });
  } else {
    res.render("404");
  }
});

app.listen(3000, function() {
  console.log("Diagnostics App has started successfully");
});
