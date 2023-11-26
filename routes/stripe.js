const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe("sk_test_51N90TmCmDfnXlQ6glt0vFDaIfQiVJs7HHli4ME2hv6ulwwqTJVNcysFELhgrAT37kdIxylh67PmPpz5Bccq5dee800Rl2THMbw");

router.post("/create-checkout-session", async (req, res) => {
  try {

    const line_items=req.body.data.map((item)=>{
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.description,
        },
        unit_amount: item.price*100,
      },
      quantity: item.cartQuantity,
    }
    })
    const session = await stripe.checkout.sessions.create({
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

module.exports = router;
