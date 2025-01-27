import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import axios from "axios";

dotenv.config();

const app = express();

const port = process.env.PORT || 8050;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/api/enrollment", async (req, res) => {
    const token = req.body.recaptchaToken;
console.log({"req": req.body});
  // Verify the reCAPTCHA token
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHSECRETKEY}&response=${token}`;

  try {
    const response = await axios.post(verifyUrl);
    const verificationData = response.data;
console.log({"verification": verificationData});
    if (verificationData.success) {
      // reCAPTCHA verification succeeded
      res.send(
        "reCAPTCHA verification succeeded. Form submitted successfully."
      );
      // Proceed with your form handling logic here
    } else {
      // reCAPTCHA verification failed
      res.send("reCAPTCHA verification failed. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    res.status(500).send("Error verifying reCAPTCHA. Please try again.");
  }
});

app.use((err, req, res, next) => {
  // console.log(err);
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

app.listen(port, () => {
  console.log(`port is listening on port ${port}...`);
});
