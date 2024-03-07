import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signInSchema } from "../helper/validate";
import axios from "axios";
import { useState } from "react";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import { userActions } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import GAuth from "../components/GAuth";
import { HiInformationCircle } from "react-icons/hi";

const initialValues = {
  Email: "",
  Password: "",
};

const SignIn = () => {
  const [showPass, setShowPass] = useState(true);
  const dispatch = useDispatch();
  const { loading, error: badCredentials } = useSelector((state) => state.user);
  // console.log(badCredentials);
  function showPassword() {
    setShowPass((prevShowPass) => !prevShowPass);
  }
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signInSchema,
    onSubmit: async (values, action) => {
      // console.log("Form values:", values);
      dispatch(userActions.signInStart());
      const postData = {
        email: values.Email,
        password: values.Password,
      };

      try {
        const response = await axios.post(`${baseURL}/sign-in`, postData);
        // console.log(response.data);
        if (response.data) {
          dispatch(userActions.signInSuccess(response.data));
          navigate("/");
        } else {
          console.log(response.data);
          // dispatch(userActions.signInFailure(response.message));
        }
      } catch (err) {
        console.log(err.response);
        dispatch(userActions.signInFailure(err.response.data.message));
      }
      action.resetForm();
    },
  });
  return (
    <div className=" min-h-screen mt-20">
      <div className="p-5 flex gap-5 max-w-lg lg:max-w-4xl mx-auto flex-col lg:flex-row">
        {/* Left side */}
        <div className="flex-1 flex flex-col items-center lg:items-start lg:justify-center">
          <Link to="/" className="text-4xl font-bold dark:text-white ">
            <span className="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
              Snoke's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            You can sign in with your email and password or with Google account.
          </p>
        </div>
        {/* Right side */}
        <div className="flex-1 max-w-lg ">
          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            {badCredentials && (
              <div className="flex justify-center items-center gap-3 bg-yellow-400 text-white p-2 rounded-lg font-semibold">
                <HiInformationCircle />
                <span>{badCredentials}</span>
              </div>
            )}
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
                <span className="text-red-500">{formik.errors.Email}</span>
              )}
            </div>
            <div className="relative">
              <Label value="Your Password" />
              <TextInput
                {...formik.getFieldProps("Password")}
                onFocus={() => formik.setFieldTouched("Password", true)}
                type={showPass ? "password" : "text"}
                placeholder="**************"
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
                <span className="text-red-500">{formik.errors.Password}</span>
              )}
            </div>

            <Button
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none"
              type="submit"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />{" "}
                  <span className="pl-3">Loading ...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <GAuth />
          </form>
          <div className="flex flex-col md:flex-row justify-between w-full items-center gap-3 text-sm mt-3">
            <div className="flex gap-3">
              <span>Don't have any account?</span>
              <Link to="/sign-up" className=" text-blue-500 font-semibold">
                Sign Up
              </Link>
            </div>
            <Link
              to="/forget-password"
              className=" text-blue-500 font-semibold"
            >
              I forget my password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
