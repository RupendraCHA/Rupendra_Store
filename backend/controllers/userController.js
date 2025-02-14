import User from "../models/userModel.js"
import asyncHandler from '../middlewares/asyncHandler.js'
import bcrypt from "bcryptjs"
import createToken from "../utils/createToken.js"

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        throw new Error("Please fill all the input fields!")
    }

    const userExists = await User.findOne({ email })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    const newUser = new User({ username, email, password: hashedPassword })

    if (userExists) {
        return res.status(400).send("User already Exists!")
    }
    try {
        await newUser.save()
        createToken(res, newUser._id)

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })

    } catch (error) {
        return res.status(400)
        throw new Error("Invalid user data!")
        // res.send("Invalid data")

    }




})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        return res.send("Enter Valid User")
    }

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if (isPasswordValid) {
            createToken(res, existingUser._id)

            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            })
            return;
        }
    }
})

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged out Successfully!!" })
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

export { createUser, loginUser, logoutCurrentUser, getAllUsers };