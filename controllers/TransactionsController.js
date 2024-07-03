import Flutterwave from "flutterwave-node-v3";
import got from "got";

export const paymentTransactions = async (req, res, next) => {
    const customersTransactions = new Transactions(req.body);
  
    try {
      const response = await got
        .post("https://api.flutterwave.com/v3/payments", {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
          json: {
            tx_ref: customersTransactions.reference_id,
            amount: customersTransactions.total,
            currency: customersTransactions.convertedPrice,
            payment_options: "card, banktransfer, ussd",
            redirect_url: "http://localhost:3001/transactions",
            // callback_url:
            //   "http://localhost:8800/api/v1/transactions/payment-callback",
            customer: {
              email: customersTransactions.email,
              phone: customersTransactions.mobileNumber,
            },
          },
        })
        .json();
      await customersTransactions.save();
  
      return res.json({ response });
    } catch (error) {
      return next(error);
    }
  };