import * as Yup from "yup";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;
const lowerCase = /^(?=.*[a-z])/;
const upperCase = /^(?=.*[A-Z])/;
const specialChar = /^(?=.*[!@#$%^&*])/;
const number = /^(?=.*\d)/;

export const signUpSchema = Yup.object({
  Username: Yup.string()
    .min(5)
    .max(15)
    .required("Please enter your Username")
    .test("username-exists", "This username is taken!", async function (value) {
      try {
        const response = await axios.post(`${baseURL}/check-user`, {
          user: value,
        });
        return !response.data; // return false will display error
      } catch (err) {
        console.log(err.message);
        return true; //there was an error during the HTTP request or that the username does not exist in the database
      }
    }),
  Email: Yup.string()
    .email("Email must be a valid email")
    .required("Please enter your email")
    .test("email-exists", "This email is taken!", async function (value) {
      try {
        const response = await axios.post(`${baseURL}/check-email`, {
          email: value,
        });
        return !response.data;
      } catch (err) {
        console.log(err);
        return true;
      }
    }),
  Password: Yup.string()
    .min(8)
    .max(25)
    .matches(lowerCase, "Password must contain a-z")
    .matches(upperCase, "Password must contain A-Z")
    .matches(specialChar, "Password must contain !@#$%^&")
    .matches(number, "Password must contain 0-9")
    .required("Please enter your password"),
  RepeatPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords didn't match")
    .required("Please enter your password again"),
});

export const signInSchema = Yup.object({
  Email: Yup.string()
    .email("Email must be a valid email")
    .required("Please enter your email"),
  Password: Yup.string().required("Please enter your password"),
});

export const MobileNumSchema = Yup.object({
  MobileNum: Yup.string()
    .min(11, "Mobile Number must be at least 11 characters")
    .max(14, "Mobile Number must be maximum 14 characters")
    .required("Please enter your Mobile Number"),
});
