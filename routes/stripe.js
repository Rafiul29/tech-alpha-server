const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { Order } = require("../model/orderModel");

const stripe = Stripe(
  "sk_test_51N90TmCmDfnXlQ6glt0vFDaIfQiVJs7HHli4ME2hv6ulwwqTJVNcysFELhgrAT37kdIxylh67PmPpz5Bccq5dee800Rl2THMbw"
);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: 2,
        cart: JSON.stringify(req.body.data),
      },
    });

    const line_items = req.body.data.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
            description: item.description,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartQuantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "BD"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.json({ error });
  }
});


// create order function
const createOrder=async(customer,data)=>{
  const Items=JSON.parse(customer.metadata.cart);
  const newOrder=new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products:Items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (err) {
    console.log(err);
  }

}

// stripe webhook
let endpointSecret;
  // "whsec_ce8552cde6b46ee9fecb4ef1c2fdaa010b3940487aa422da7fcd0a30ecffa492";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    let sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("webhook verifided");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer,data);
        })
        .catch((err) => console.log(err, message));
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

module.exports = router;
