// Place order COD  : api/order/cod

import Orders from "../models/order.model.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"

export const placeOrderCod = async (req,res) => {
    try {
        const {userId,items,address} = req.body
        if(!address || items.length === 0){
            return res.status(401).json({
                success : false,
                message : "Invalid data"
            })
        }
        // calculate amount using items
        let amount = await items.reduce( async(acc,item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice  * item.quantity
        },0)

        // Add tax Charge (2%)
        amount += Math.floor(amount * 0.02)
        await Orders.create({
            userId,
            items,
            amount,
            address,
            paymentType : "COD"

        })

        return res.status(200).json({
            success : true,
            message : "Orders placed Successfully"
        })
    } catch (error) {
        return res.status(502).json({
            success  : false,
            message : error.message
        })
        
    }
}

// place order stripe : /api/order/stripe

import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    console.log("REQ.BODY:", JSON.stringify(req.body, null, 2));

    // Validate inputs
    if (!userId || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    let amount = 0;
    const productData = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      productData.push({
        name: Array.isArray(product.name) ? product.name[0] : product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    console.log("Items to order:", productData);
    console.log("Calculated amount:", amount);
    console.log("Address:", address);

    const order = await Orders.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Stripe",
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 100), // Stripe expects price in cents
      },
      quantity: item.quantity,
    }));

    console.log("LINE ITEMS:", JSON.stringify(line_items, null, 2));
    console.log("METADATA:", {
      orderId: String(order._id),
      userId: String(userId),
    });

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: String(order._id),
        userId: String(userId),
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    return res.status(502).json({
      success: false,
      message: error.message,
    });
  }
};

// Stripe Webhooks to verify payments action :/stripe

export const stripeWebhooks = async (request,response) => {
  // stripe gateway intialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.header["stripe-signature"]
  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error : ${error.message}`)
  }

  //Handle the event
  switch(event.type){
    case "payment_intent.succeeded" : {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.Id;

      // getting session meta data
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId,
      })
      const {orderId,userId} = session.data[0].metadata
      //mark payment as paid
      await Orders.findByIdAndUpdate(orderId,{isPaid : true})
      // Clear cart
      await User.findByIdAndUpdate(userId,{cartItems : {}})
      break;
    }
    case "payment_intent.payment_failed" : {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.Id;

      // getting session meta data
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { orderId } = session.data[0].metadata;
      await Orders.findByIdAndDelete(orderId);
      break;
    }
    default:
      console.error(`Unhandled event type ${event.type}`);  
      break ;
  }
  response.json({received : true})
}


// Get Orders by user id : /api/order/user

export const getUserOrder = async(req,res) => {
    try {
        const {userId} = req.body
        const orders = await Orders.find({
            userId,
            $or : [{paymentType : "COD"},{isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1})
        res.status(200).json({
            success : true,
            orders
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// get all orders fo seller /admin : /api/order/seller

export const getAllOrders = async(req,res) => {
  try {
      const orders = await Orders.find({
          $or : [{
              paymentType : "COD"
          },
      {
          isPaid : true
      }]
        }).populate("items.product address").sort({createdAt : -1})
        return res.status(200).json({
          success : true,
          orders
        })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

