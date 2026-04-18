import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';

/**
 * TODO: Register a new user
 *
 * 1. Extract name, email, password from req.body
 * 2. Check if user with email already exists
 *    - If yes: return 409 with { error: { message: "Email already exists" } }
 * 3. Create new user (password will be hashed by pre-save hook)
 * 4. Return 201 with { user } (password excluded by default)
 */
export async function register(req, res, next) {
  try {
    const  {name , email , password} =req.body;

    if(!name || !email || !password){
      const err = new Error("should require password field");
      err.status = 400;
      throw err;
    }

    const user = await User.findOne({email});

    if(user) {
      const err = new Error("Email already exists");
      err.status = 409;
      throw err;
    }

    const newUser = await User.create({name,email,password});

    const userObj = newUser.toObject();
    delete userObj.password

    res.status(201).send({user : userObj});
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Login user
 *
 * 1. Extract email, password from req.body
 * 2. Find user by email (use .select('+password') to include password field)
 * 3. If no user found: return 401 with { error: { message: "Invalid credentials" } }
 * 4. Compare password using bcrypt.compare(password, user.password)
 * 5. If password wrong: return 401 with { error: { message: "Invalid credentials" } }
 * 6. Generate JWT token with payload: { userId: user._id, email: user.email, role: user.role }
 * 7. Return 200 with { token, user } (exclude password from user object)
 */
export async function login(req, res, next) {
  try {
    // Your code here
    const {email , password} = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.status = 400;
      throw err;
    }

    const user = await User.findOne({email : email.toLowerCase()}).select("+password");

    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const compairedPassword = await bcrypt.compare(password,user.password);

    if (!compairedPassword) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const jwtToken = signToken({userId : user._id , email : user.email , role : user.role});

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({token : jwtToken,user : userObj});
  } catch (error) {
    next(error);
  }


}

/**
 * TODO: Get current user
 *
 * 1. req.user is already set by auth middleware
 * 2. Return 200 with { user: req.user }
 */
export async function me(req, res, next) {
  try {
    res.status(200).json({
      user : req.user
    })
  } catch (error) {
    next(error);
  }
}
