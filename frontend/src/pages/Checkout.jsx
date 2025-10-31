import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingData = location.state;
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const basePrice =
    bookingData.experience.slots.find(
      (slot) =>
        slot.date === bookingData.slotDate &&
        slot.startTime === bookingData.slotStartTime
    )?.price || 0;

  const subtotal = basePrice * bookingData.participants;
  const discount = appliedPromo?.discountAmount || 0;
  const total = subtotal - discount;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/promo/validate`, {
        code: promoCode,
        totalAmount: subtotal,
      });

      if (response.data.success) {
        setAppliedPromo(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Failed to validate promo code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        experienceId: bookingData.experienceId,
        slotDate: bookingData.slotDate,
        slotStartTime: bookingData.slotStartTime,
        participants: bookingData.participants,
        customerInfo: formData,
        promoCode: appliedPromo?.code,
      });

      navigate("/booking-result", {
        state: {
          success: true,
          booking: response.data.data,
        },
      });
    } catch (error) {
      navigate("/booking-result", {
        state: {
          success: false,
          message: error.response?.data?.message || "Booking failed",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-lg font-semibold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Form Section */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-sm space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                  className="border border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-lg px-3 py-2 bg-gray-50 text-sm outline-none transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  required
                  className="border border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-lg px-3 py-2 bg-gray-50 text-sm outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Promo code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 border border-gray-300 focus:border-yellow-400 rounded-lg px-3 py-2 bg-gray-50 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm transition"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-green-600 text-xs mt-1">
                  Promo applied! Discount: ₹{appliedPromo.discountAmount}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" required />
              <span>I agree to the terms and safety policy</span>
            </div>
          </form>

          {/* Right Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-sm space-y-3">
            <h2 className="text-base font-semibold mb-3">Experience</h2>
            <div className="flex justify-between">
              <span className="text-gray-600">Experience</span>
              <span>{bookingData.experience.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span>{bookingData.slotDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span>{bookingData.slotStartTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qty</span>
              <span>{bookingData.participants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes</span>
              <span>₹59</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 mt-3 rounded-lg font-medium text-sm ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black transition"
              }`}
            >
              {loading ? "Processing..." : "Pay and Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
