import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
  const { axios } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("http://localhost:4000/api/contact", {
        name,
        email,
        message,
      });
      if (data.success) {
        toast.success("Message sent successfully");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl overflow-hidden grid md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-green-600 text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-green-100 mb-6">
            We’d love to hear from you. Fill out the form and we’ll get back to
            you soon.
          </p>

          <div className="space-y-4 text-sm">
            <p>📍 Shimla, Himachal Pradesh</p>
            <p>📧 amitparihar1208@gmail.com</p>
            <p>📞+91 7876222474</p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-6">
            Contact Us
          </h3>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Your Message"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={10}
                maxLength={100}
              ></textarea>
            </div>

            <button
              type="submit"
              className=" cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
