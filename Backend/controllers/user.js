const {
    validateEmail,
    validateLength,
    validateUsername,
} = require("../helpers/validation");

const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const cloudinary = require("cloudinary");
const {generateToken} = require("../helpers/tokens");
// const {sendVerificationEmail, sendResetCode} = require("../helpers/mailer");
// const generateCode = require("../helpers/generateCode");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
    try {
        const {
            email,
            haslo,
            imie,
            kierunek,
            nazwisko,
            nick,
            rok,
            uczelnia
        } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({message: "Niepoprawny adres email"});
        }
        const check = await User.findOne({email});
        if (check) {
            return res.status(400).json({message: "Ten adres email już istnieje. Spróbuj z innym adresem email"});
        }

        if (!validateLength(imie, 3, 30)) {
            return res.status(400).json({message: "Imię musi mieć od 3 do 30 znaków."});
        }
        if (!validateLength(nazwisko, 3, 30)) {
            return res.status(400).json({message: "Nazwisko musi mieć od 3 do 30 znaków."});
        }
        if (!validateLength(haslo, 6, 40)) {
            return res.status(400).json({message: "Hasło musi mieć przynajmniej 6 znaków."});
        }

        const cryptedPassword = await bcrypt.hash(haslo, 12);

        const newUsername = imie + nazwisko;

        const user = await new User({
            first_name: imie,
            last_name: nazwisko,
            email: email,
            password: cryptedPassword,
            username: newUsername,
            university: uczelnia,
            field: kierunek,
            year: rok
        }).save();

        res.status(201).json({message: "Użytkownik został pomyślnie zarejestrowany."});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.activateAccount = async (req, res) => {
    try {
        const validUser = req.user.id;
        const {token} = req.body;
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        const check = await User.findById(user.id);

        if (validUser !== user.id) {
            return res.status(400).json({
                message: "You don't have the authorization to complete this operation.",
            });
        }
        if (check.verified == true) {
            return res
                .status(400)
                .json({message: "This email is already activated."});
        } else {
            await User.findByIdAndUpdate(user.id, {verified: true});
            return res
                .status(200)
                .json({message: "Account has beeen activated successfully."});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message:
                    "the email address you entered is not connected to an account.",
            });
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({
                message: "Invalid credentials.Please try again.",
            });
        }
        const token = generateToken({id: user._id.toString()}, "7d");
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.sendVerification = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (user.verified === true) {
            return res.status(400).json({
                message: "This account is already activated.",
            });
        }
        const emailVerificationToken = generateToken(
            {id: user._id.toString()},
            "30m"
        );
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
        sendVerificationEmail(user.email, user.first_name, url);
        return res.status(200).json({
            message: "Email verification link has been sent to your email.",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
exports.findUser = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email}).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "Account does not exists.",
            });
        }
        return res.status(200).json({
            email: user.email,
            picture: user.picture,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.sendResetPasswordCode = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email}).select("-password");
        await Code.findOneAndRemove({user: user._id});
        const code = generateCode(5);
        const savedCode = await new Code({
            code,
            user: user._id,
        }).save();
        sendResetCode(user.email, user.first_name, code);
        return res.status(200).json({
            message: "Email reset code has been sent to your email",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.validateResetCode = async (req, res) => {
    try {
        const {email, code} = req.body;
        const user = await User.findOne({email});
        const Dbcode = await Code.findOne({user: user._id});
        if (Dbcode.code !== code) {
            return res.status(400).json({
                message: "Verification code is wrong..",
            });
        }
        return res.status(200).json({message: "ok"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.changePassword = async (req, res) => {
    const {email, password} = req.body;
    const cryptedPassword = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate(
        {email},
        {
            password: cryptedPassword,
        }
    );
    return res.status(200).json({message: "ok"});
};