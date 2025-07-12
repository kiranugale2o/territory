import React, { useContext } from "react";
import { View, Button, Alert } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { AuthContext } from "../context/AuthContext";

const updatePropertyInfo = async (id) => {
  if (!id) {
    return;
  }
  try {
    const response = await fetch(
      `https://api.reparv.in/sales/properties/updatepropertyinfo/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to update property info");
    }
    console.log("Update successful:", result);
    return result;
  } catch (error) {
    console.error("Error updating property info:", error);
    throw error;
  }
};

export const payNow = async (
  email,
  contact,
  name,
  auth,
  propertyid,
  salespersonid,
  enquiryid
) => {
  // const options = {
  //   description: "Purchase",
  //   image: "https://your-logo-url.com/logo.png",
  //   currency: "INR",
  //   key: "rzp_live_s6oE9En9AyWvsD", // Use TEST key during development!
  //   amount: 1.18 * 100,
  //   name: "Reparv Sales Partner ",
  //   prefill: {
  //     email: email,
  //     contact: contact,
  //     name: name,
  //   },
  //   theme: { color: "#53a20e" },
  // };

  try {
    // 1. Call backend to create order
    const response = await fetch(
      "https://api.reparv.in/api/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1.18 }), // amount in paise
      }
    );
    const order = await response.json();
    console.log(order);

    // 2. Prepare options for Razorpay checkout
    const options = {
      description: "Purchase",
      image: "https://your-logo-url.com/logo.png",
      currency: "INR",
      key: "rzp_live_s6oE9En9AyWvsD",
      amount: order.amount, // amount in paise from backend
      order_id: order.id, // order id from backend
      name: "Reparv territory Partner",
      prefill: {
        email,
        contact,
        name,
      },
      theme: { color: "#53a20e" },
    };

    // 3. Open Razorpay checkout
    RazorpayCheckout.open(options)
      .then(async (data) => {
        const {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        } = data;
        auth?.setIsPaymentSuccess(true);

        //book
        try {
          const response = await fetch(
            "https://api.reparv.in/api/booking/bookenquiryproperty/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                enquiryid,
                propertyinfoid: auth.propertyinfoId,
                amount: 1.18,
                paymentid: razorpay_order_id,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Booking failed:", errorData);
            Alert.alert("Booking failed", errorData.message || "Unknown error");
            auth?.setPropertyinfoId(null);
            return;
          }

          await updatePropertyInfo(auth?.propertyinfoId);

          const bookingData = await response.json();
          console.log("Booking successful:", bookingData);
          // Alert.alert("Booking confirmed!");
          auth?.setPropertyinfoId(null);
        } catch (err) {
          console.error("Error during booking:", err);
          Alert.alert("Network error. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Payment cancelled or failed:", error);
        Alert.alert("Payment was cancelled or failed.");
      });
  } catch (error) {
    console.error("Error creating order:", error);
  }
};
