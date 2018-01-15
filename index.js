const express = require("express");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employee");
const userRoutes = require("./routes/user");
const fileUpload = require("express-fileupload");

const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

const jwt = require("jsonwebtoken");

const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));
app.use(passport.initialize());

passport.use("auth", new BearerStrategy((token, done) => {
    // if (token == "1234") {
    //     return done(null, { name: "User 1" });
    // } else {
    //     return done("User Not Authorized", null);
    // }

    jwt.verify(token, "secretkey", (error, decoded) => {
       
        if (error) {
            return done("User Not Authorized", null);
        } else {
            console.log(decoded);
            return done(null, decoded);
       
        }
    
    })

}));

app.post("/api/validatetoken", passport.authenticate("auth", { session: false }), (req, res) => {
    // res.send("Berhasil")
    res.send(req.user);
});

// app.post("/login", (req, res) => {

//     if (req.body.username == "user" && req.body.password == "abc123") {
        
//         const payload = {
//             id: "USR10012018",
//             name: "user"
//         };

//         const token = jwt.sign(payload, "secretkey", { expiresIn: 1000 });
//         res.json({ token: token });

//     } else {
//         res.status(404).json({ message: "User Not Found"});
//     }
// })

// app.post("/upload", (req, res) => {
//     if (!req.files.image) {
//         return res.status(400).send("No files were upload");
//     }
//     let image = req.files.image;

//     let date = new Date(); // penamaan image berdasar waktu
//     let imageName = date.getTime() + ".png" // // penamaan image berdasar waktu
//     image.mv("./public/" + imageName, (error) => {
//         if (error) return res.status(500).send(error);

//         // res.send("Upload Success!")
//         res.json({ path : "http://localhost:3000/" + imageName }) // menampilkan image di frontend
//     });
// });

app.get("/", (req, res) => {
    res.send("Ready !");
})

app.use("/api/employee", employeeRoutes(passport));
app.use("/api/user", userRoutes);

app.listen(process.env.PORT || 3000);