const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      flash = require('connect-flash'),
      User = require('./models/user'),
      app = express();

const calendarRoutes = require('./routes/calendar'),
      authRoutes = require('./routes/auth'),
      indexRoutes = require('./routes/index');

const connectString = "mongodb+srv://ankit1234:ankit1234@cluster0-glzmx.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;

mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(() => {
    console.log("Database connected...");
}).catch(() => {
    console.log("Cannot connect to the database...");
});

app.use(flash());

app.use(require('express-session')({
    secret: "Calendar app is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
});

app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(calendarRoutes);
app.use(authRoutes);
app.use(indexRoutes);

app.listen(PORT, () => {
    console.log("Server started visit: http://localhost:3000/");
});
