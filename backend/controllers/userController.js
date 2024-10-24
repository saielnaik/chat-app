const Users = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const userCheck = await Users.findOne({ username });
        if (userCheck) {
            return res.json({ msg: "Username already used", status: false });
        }

        const emailCheck = await Users.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            username,
            email,
            password: hashedPassword,
        });

        const userResponse = { ...user._doc };
        delete userResponse.password;

        return res.json({ status: true, user: userResponse });
    } catch (error) {
        next(error);
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const userExist = await Users.findOne({ username });
        if (!userExist) {
            return res.json({ msg: "Incorrect User Name or Password", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password);

        if (!isPasswordValid) {
            return res.json({ msg: "Incorrect User Name or Password", status: false });
        }

        const userResponse = { ...userExist._doc };
        delete userResponse.password;

        return res.json({ status: true, user: userResponse });
    } catch (error) {
        next(error);
    }
};


module.exports.avatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await Users.findByIdAndUpdate(
            userId,
            { isAvatarImageSet: true, avatarImage },
            { new: true }
        );

        if (!userData) {
            return res.status(404).json({ msg: "User not found", status: false });
        }

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (error) {
        next(error);
    }
};


module.exports.allusers = async (req, res, next) => {
    try {
        const users = await Users.find({_id: {$ne: req.params.id} }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
}