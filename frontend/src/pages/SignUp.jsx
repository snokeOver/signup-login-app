import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpSchema } from "../helper/validate";
import axios from "axios";
import { useState } from "react";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import GAuth from "../components/GAuth";

const initialValues = {
  Username: "",
  Email: "",
  Password: "",
  RepeatPassword: "",
};

const SignUp = () => {
  const [showPass, setShowPass] = useState(true);
  function showPassword() {
    !setShowPass((prevShowPass) => !prevShowPass);
  }
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,

    onSubmit: async (values, action) => {
      // console.log("Form values:", values);
      const postData = {
        user: values.Username,
        email: values.Email,
        password: values.Password,
      };

      try {
        const response = await axios.post(`${baseURL}/sign-up`, postData);
        // console.log(response);
      } catch (err) {
        console.log(err.response.data);
      }
      action.resetForm();
      navigate("/sign-in");
    },
  });
  return (
    <div className=" min-h-screen mt-20">
      <div className="p-5 flex gap-5 max-w-lg lg:max-w-3xl mx-auto flex-col lg:flex-row">
        {/* Left side */}
        <div className="flex-1 flex flex-col items-center lg:items-start lg:justify-center">
          <Link to="/" className="text-4xl font-bold dark:text-white ">
            <span className="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
              Snoke's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            You can signup with your email and password or with Google account.
          </p>
        </div>
        {/* Right side */}
        <div className="flex-1 max-w-lg ">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div>
              <Label value="Your Username" />
              <TextInput
                {...formik.getFieldProps("Username")}
                onFocus={() => formik.setFieldTouched("Username", true)}
                type="text"
                placeholder="Username"
                id="userName"
              />
              {formik.touched.Username && formik.errors.Username && (
                <span className="text-yellow-300">
                  {formik.errors.Username}
                </span>
              )}
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                {...formik.getFieldProps("Email")}
                onFocus={() => formik.setFieldTouched("Email", true)}
                type="email"
                placeholder="name@domain.com"
                id="email"
              />
              {formik.errors.Email && formik.touched.Email && (
                <span className="text-yellow-300">{formik.errors.Email}</span>
              )}
            </div>
            <div className="relative">
              <Label value="Your Password" />
              <TextInput
                {...formik.getFieldProps("Password")}
                onFocus={() => formik.setFieldTouched("Password", true)}
                type={showPass ? "password" : "text"}
                placeholder="Password"
                id="password"
              />
              <button
                type="button"
                onClick={showPassword}
                className="absolute right-2 top-[2.1rem]   text-gray-500 rounded-lg text-2xl "
              >
                {showPass ? <LiaEyeSolid /> : <LiaEyeSlash />}
              </button>
              {formik.errors.Password && formik.touched.Password && (
                <span className="text-yellow-300">
                  {formik.errors.Password}
                </span>
              )}
            </div>
            <div className="relative">
              <Label value="Repeat Your Password" />
              <TextInput
                {...formik.getFieldProps("RepeatPassword")}
                onFocus={() => formik.setFieldTouched("RepeatPassword", true)}
                type={showPass ? "password" : "text"}
                placeholder="Repeat Password"
                id="repeatPassword"
              />
              {formik.errors.RepeatPassword &&
                formik.touched.RepeatPassword && (
                  <span className="text-yellow-300">
                    {formik.errors.RepeatPassword}
                  </span>
                )}
            </div>
            <Button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none"
              type="submit"
            >
              Sign Up
            </Button>
            <GAuth />
          </form>
          <div className="flex gap-3 text-sm mt-3">
            <span>Have an account?</span>
            <Link to="/sign-in" className=" text-blue-500 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
