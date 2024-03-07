import errorHandler from "../../routes/errorHandler.js";
import otpModel from "../../schemas/otpSchema.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import dotenv from "dotenv";
dotenv.config();

const fromEamil = process.env.MY_EMAIL;
const userEmailPass = process.env.MY_EMAIL_PASS;

const sendEmail = (codeToSend, emailToSend) => {};

export const sendOTPToEmail = async (req, res, next) => {
  const codeToSend = req.code;
  const emailToSend = req.email;

  try {
    let config = {
      service: "gmail",
      auth: {
        user: fromEamil,
        pass: userEmailPass,
      },
    };
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Snoke Blog",
        link: "https://google.com",
      },
      header: {
        title: "Snoke Blog",
        imageUrl: "https://yourapp.com/header-image.png",
      },
      footer: {
        copyright: "© 2024 Snoke Blog. All rights reserved.",
        unsubscribe: "Unsubscribe here",
        imageUrl: "https://yourapp.com/footer-image.png",
      },
    });
    let response = {
      body: {
        intro: "Use this code to veryfy your e-mail.",
        table: {
          data: [
            {
              "6 Digits Code": codeToSend,
            },
          ],
        },
        outro: "If you didn't require this. Just ignore this e-mail",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: fromEamil,
      to: emailToSend,
      subject: "e-mail Verification Code",
      html: mail,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        // console.log("Error sending email:", error);
        return next(errorHandler(error));
      } else {
        // console.log("Email Sent:", info.response);
        return res.status(200).send({ Message: "Otp sent Successfully" });
      }
    });
  } catch (err) {
    next(errorHandler(err.message));
    console.log(err.message);
  }
};
