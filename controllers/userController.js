const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User } = require("../models")

const fs = require("fs")
const util = require("util")

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

exports.protect = async (req, res, next) => {
  try {
    let token = null
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }
    if (!token) return res.status(401).json({ message: "You are unauthorized" })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log(payload)
    const user = await User.findOne({ where: { id: payload.id } })
    if (!user) return res.status(400).json({ message: "user not found" })
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

exports.me = async (req, res, next) => {
  try {
    const {
      id,
      username,
      userType,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    } = req.user
    res.status(200).json({
      id,
      username,
      userType,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    })
  } catch (err) {
    next(err)
  }
}

exports.guest = async (req, res, next) => {
  if (!req.headers.authorization) {
    const data = await readFile("./guests.json", "utf8")
    const guests = JSON.parse(data)
    console.log(guests)
    console.log(guests.guests[guests.guests.length - 1])
    const guestId = guests.guests[guests.guests.length - 1].guestId + 1
    console.log(guestId)
    const token = await jwt.sign({ guestId }, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    })
    guests.guests.push({ guestId, cart: [] })
    await writeFile("./guests.json", JSON.stringify(guests))
    console.log(guests)
    res.status(200).json({ token })
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log(payload)
    const data = await readFile("./guests.json", "utf8")
    const guests = JSON.parse(data)
    res.status(200).json({ message: "Continue shopping with existed guestId" })
  } else next()
}

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username && !username.trim())
      return res.status(400).json({ message: "please insert username" })
    if (!password)
      return res.status(400).json({ message: "please insert password" })
    const user = await User.findOne({ where: { username } })
    if (!user)
      return res.status(400).json({ message: "username or password is wrong" })
    const isPasswordCorrected = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrected)
      return res.status(400).json({ message: "username or password is wrong" })
    const payload = {
      id: user.id,
      username: user.username,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      postCode: user.postCode,
      profilePictureId: user.profilePictureId,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
}

exports.register = async (req, res, next) => {
  try {
    const {
      username,
      password,
      userType,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    } = req.body
    const isUsernameExist = await User.findOne({ where: { username } })
    if (isUsernameExist)
      return res.status(400).json({ message: "username exist already" })
    const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT)
    console.log(hashedPassword)
    const user = await User.create({
      username,
      password: hashedPassword,
      userType,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    })
    // console.log(user)

    const payload = {
      id: user.id,
      userType,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: +process.env.JWT_EXPIRES_IN,
    })
    console.log(token)

    res.status(201).json({ token })
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.user
    const {
      password,
      firstName,
      lastName,
      phoneNumber,
      email,
      profilePictureId,
    } = req.body
    // const user = User.findOne({ where: { id } })
    // const isPasswordCorrected = bcrypt.compare(password, user.password)
    // if (!isPasswordCorrected)
    //   return res.status(400).json({ message: "Password is incorrected" })
    const updatedUser = User.update(
      {
        firstName,
        lastName,
        phoneNumber,
        email,
        profilePictureId,
      },
      { where: { id } }
    )
    res.status(200).json({ updatedUser })
  } catch (err) {
    next(err)
  }
}
