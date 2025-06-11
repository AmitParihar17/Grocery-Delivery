// Register User : /api/user/register

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required to register",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie('token',token , {
        httpOnly : true, // Prevent Js to access cookie
        secure : process.env.NODE_ENV = "production" , // use secure key in production
        sameSite : process.env.NODE_ENV = "production" ? "none" : 'strict' , //CSRF protection
        maxAge : 7 *24 * 60 * 60 * 1000, //Cookie expiration time
    })

    return res.json({
        success : true,
        user : {email : user.email , name : user.name}
    })

  } catch (error) {
    console.log(error.message );
    
    res.json({
        success : false,
        message : error.message,
    })
  }
};

// Login user : api/user/login

export const login = async(req,res) => {
   try {
    const {email,password} = req.body;

    if(!email || !password){
        return res.json({
          success : false,
          message : "Email and password are required"
        })
    }

    const user = await User.findOne({email})

    if(!user){
      return res.json({
        success : false,
        message : "invalid email or password",
      })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
      return res.json({
        success : false,
        message : "Invalid Password",
      })
    }

    const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : "7d"})

    res.cookie('token',token , {
      httpOnly : true, // prevent js to access cookie
      secure : process.env.NODE_ENV === "production" , //use secure cookie in productions 
      sameSite : process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge : 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    })

    return res.json({
      success : true,
    user  : {email : user.email,name : user.name}
    })

   } catch (error) {
    console.log(error.message);
    res.json({success : false,message : error.message})
   }
}

// Check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
  try {
    const userId = req.userId; // coming from middleware
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing in request",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("isAuth error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



// Logout user : api/user/logout

 export  const logout = async(req,res) => {
  try {
      res.clearCookie('token',{
        httpOnly : true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'
      })
      return res.json({
        success : true ,
        message : "Logged Out"
      })
  } catch (error) {
    console.log(error.message)
    res.json({
      success : false,
      message : error.message
    })
  }
 };
