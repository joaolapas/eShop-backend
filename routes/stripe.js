const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { Order } = require("../models/Order");

router.post("/create-checkout-session", async (req, res) => {
  console.log('hey');
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.user,
    },
  });
  //console.log(JSON.stringify(req.body.cart));

  const line_items = req.body.cart.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.description,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "PT", "GB", "DE", "ES", "FR", "IT"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "eur",
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
            amount: 2000,
            currency: "eur",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 2,
            },
            maximum: {
              unit: "business_day",
              value: 3,
            },
          },
        },
      },
    ],
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `${process.env.YOUR_DOMAIN}/checkoutSuccess`,
    cancel_url: `${process.env.YOUR_DOMAIN}/cart`,
  });

  res.send({ url: session.url });
});

const createOrder = async (customer, data, lineItems) => {
  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    items: lineItems.data,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    paymentStatus: data.payment_status,
    deliveryStatus: data.delivery_status,
  });
  console.log("dentro do createOrder");
  try {
    const order = await newOrder.save();
    console.log("saved order:", order);
  } catch {
    (err) => {
      console.log("erro:", err);
    };
  }
};

//endpointSecret =
//  "whsec_91cf7af52fbe3906f108e372d4fd50005eba797f47507222430d9dc87a60846f";

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (request, response) => {
    let endpointSecret;
    let data;
    let eventType;

    if (endpointSecret) {
      const sig = request.headers["stripe-signature"];
      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          endpointSecret
        );
        console.log(`webhook verified`);
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = request.body.data.object;
      eventType = request.body.type;
    }
    
    //handle webhook events here
    if (eventType === "checkout.session.completed") {
      
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // CREATE ORDER
            createOrder(customer, data, lineItems);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => {
          console.log("errinho:", err.message);
        });
    }

    response.send();
  }
);

module.exports = router;
