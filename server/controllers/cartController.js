import User from "../models/user.model.js";

// Update user cart data : /api/cart/update

 export const updateCart = async (req, res) => {
  try {
    const { id, cartItems } = req.body;
    await User.findByIdAndUpdate(id,{cartItems})
    res.status(200).json({
        success : true,
        message : "Cart  updated"
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
        success : false,
        message : error.message
    })
  }
};
