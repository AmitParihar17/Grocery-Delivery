import Address from "../models/address.model.js";

// Add Address : POST /api/address/add
export const address = async (req, res) => {
  try {
    const { address } = req.body; // userId is inside here
    console.log("Incoming address data:", req.body);

    await Address.create(address); // pass the full address object (with userId inside)

    res.status(200).json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

//Get adress : /api/address/get

export const getAddress = async (req,res) => {
  try {
    const { userId } = req.query;
    const addresses = await Address.find({userId})
    res.status(200).json({
        success : true,
        addresses
    })

  } catch (error) {
    console.log(error.message);
    res.status(501).json({
      success: false,
      message: error.message,
    })
  }
};
