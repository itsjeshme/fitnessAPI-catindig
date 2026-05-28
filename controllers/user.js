const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth");


// Login User
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {  

        return User.findOne({ email: req.body.email })
        .then(result => {


            if(result == null) {

                return res.status(404).send({ error: "No Email Found" });
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if(isPasswordCorrect) {
                    console.log(isPasswordCorrect)
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send({ error: "Email and password do not match" });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        return res.status(400).send({ error: "Invalid Email" });
    }
}


// Register User
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")) {
        return res.status(400).send({
            error: "Email invalid"
        });
    }

    if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({
            error: "Mobile number invalid"
        });
    }

    if (req.body.password.length < 8) {
        return res.status(400).send({
            error: "Password must be at least 8 characters"
        });
    }

    return User.findOne({ email: req.body.email })
    .then(existingUser => {

        if(existingUser) {
            return res.status(409).send({
                error: "Email already registered"
            });
        }

        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
        .then(() => {
            return res.status(201).send({
                message: "Registered Successfully"
            });
        });

    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
        .then(user => {

            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            const userObj = user.toObject();
            delete userObj.password;

            return res.status(200).send(userObj);
        })
        .catch(error => errorHandler(error, req, res));
};