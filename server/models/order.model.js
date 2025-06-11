import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "address",
    },
    status: {
      type: String,
      default: "Order Placed",
    },
    paymentType: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.models.orders || mongoose.model("orders",orderSchema)

export default Orders