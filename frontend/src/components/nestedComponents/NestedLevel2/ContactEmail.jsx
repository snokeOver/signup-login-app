import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../redux/userSlice.js";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { app } from "../../../firebase.js";

import axios from "axios";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Button, Modal, Label, TextInput } from "flowbite-react";
import { BsFillShieldLockFill } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { TiTick } from "react-icons/ti";
import { number } from "yup";
import CountdownTimer from "./CountDownTimmer.jsx";

const ContactEamil = ({ handleUpdate }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [openModal, setOpenModal] = useState(false);
  const { currentUser, loading, count, error } = useSelector(
    (state) => state.user
  );
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const auth = getAuth(app);

  const [showEamilModla, setShowEamilModal] = useState(true);
  const [validEmail, setValidEmail] = useState(false);
  const [emailTakenError, setEmailTakenError] = useState("");
  const [currentEamil, setCurrentEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [otpErrorMsg, setOtpErrorMsg] = useState("");

  const [success, setSuccess] = useState(false);

  const [verifyOtp, setVerifyOtp] = useState(false);

  // Check whether the input email is valid and not taken
  useEffect(() => {
    const checkPhoneValidity = async (currentEamil) => {
      try {
        const response = await axios.post(`${baseURL}/check-email`, {
          email: currentEamil,
        });
        if (response.data) {
          setValidEmail(false);
          setEmailTakenError(`${currentEamil} is Taken!`);
        } else {
          setValidEmail(true);
          setEmailTakenError("");
        }
      } catch (err) {
        setValidEmail(false);
        setEmailTakenError(err.message);
      }
    };
    //  console.log(currentEamil);
    function isValidEmail(email) {
      // Regular expression for a valid email pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Test the email against the pattern
      return emailPattern.test(email);
    }

    if (currentEamil !== currentUser.userEmail.email) {
      if (isValidEmail(currentEamil)) {
        checkPhoneValidity(currentEamil);
      } else {
        setEmailTakenError("");
        setValidEmail(false);
      }
    }
  }, [currentEamil]);

  // Take the initial email from current user
  useEffect(() => {
    if (!currentUser.userEmail.email.startsWith("rand")) {
      setValidEmail(true);
      setEmailTakenError(false);
      setOtpErrorMsg(false);
      setCurrentEmail(currentUser.userEmail.email);
    }
  }, []);

  //   send opt via e-mail
  const sendOTPToEmail = async () => {
    dispatch(userActions.emailOtpSendStart());

    const postData = {
      email: currentEamil,
    };
    try {
      const response = await axios.post(
        `${baseURL}/send-otp-to-email/${currentUser._id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.access_token}`,
          },
        }
      );
      if (response.data) {
        dispatch(userActions.emailOtpSendSuccess());
        setShowEamilModal(false);

        //   handleUpdate("Updated Successfully!");
        //   setOpenModal(false);
      } else {
        dispatch(userActions.emailOtpSendFailure(response.message));
        console.log("The response:", response.message);
      }
    } catch (err) {
      dispatch(userActions.emailOtpSendFailure(err.response.data));
    }
  };

  //   Take action when user wish to resend e-mail
  const notGetOtp = () => {
    const timeOut = 2 * 60; //This is the time after that user can resend otp via e-mail
    setShowEamilModal(true);
    dispatch(userActions.emailOtpReceiveFailure(timeOut));
    setOtpErrorMsg("");
  };

  //   Check the otp and verify the e-mail
  useEffect(() => {
    const sendOtpToDb = async (postData) => {
      try {
        dispatch(userActions.updateStart());
        const response = await axios.patch(
          `${baseURL}/verify-email/${currentUser._id}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${currentUser.access_token}`,
            },
          }
        );
        if (response.data) {
          setOtpErrorMsg(response.data.Message);
          if (response.status === 200) {
            dispatch(userActions.updateSuccess(response.data));
            handleUpdate("Updated Successfully!");
            setOpenModal(false);
          }
        } else {
          console.log("The response:", response.message);
          dispatch(userActions.UpdateFailure(response.message));
        }
      } catch (err) {
        console.log("The error Catch:", err.response.data);
        dispatch(userActions.UpdateFailure(err.response.data.message));
      }
    };
    if (otp.length === 6) {
      const postData = {
        email: currentEamil,
        otpCode: otp,
      };
      sendOtpToDb(postData);
    }
  }, [otp]);

  return (
    <span className="relative">
      <Label value="Email Address" />
      <TextInput
        disabled
        type="email"
        placeholder={
          !currentUser.userEmail.email.startsWith("rand")
            ? currentUser.userEmail.email
            : "Update Your e-mail"
        }
        id="emailId"
      />
      <span className="absolute right-2 top-[2rem]    ">
        {currentUser.userEmail.email.startsWith("rand") ? (
          <button
            className="border border-gray-400 text-xs rounded-md px-2 py-1"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Update
          </button>
        ) : currentUser.userEmail.isVerified ? (
          <div className="flex items-center text-green-400  mt-[0.1rem] ">
            <span className="text-sm"> Verified</span>
            <TiTick className="ml-3" />
          </div>
        ) : (
          <button
            className="border border-gray-400 text-xs rounded-md px-2 py-1"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Verify
          </button>
        )}
      </span>

      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className={theme}
        position="top-center"
        size="md"
      >
        <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-gray-700">
          <Modal.Header>Verify & Update your e-mail</Modal.Header>

          {showEamilModla ? (
            <>
              {/* first part */}
              <Modal.Body>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className=" bg-gray-200 text-gray-700 text-3xl w-fit p-2 rounded-full">
                    <MdOutlineMarkEmailRead />
                  </div>
                  <div className="flex flex-col text-gray-700  justify-center items-center gap-5  w-full">
                    <Label value="Enter your e-mail" className="text-lg" />
                    <TextInput
                      className="w-[80%]"
                      type="email"
                      placeholder={
                        currentUser.userEmail.email.startsWith("rand")
                          ? "name@domain.com"
                          : currentUser.userEmail.email
                      }
                      id="email"
                      onChange={(e) => setCurrentEmail(e.target.value)}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-center items-center">
                {validEmail &&
                  !emailTakenError &&
                  !otpErrorMsg &&
                  (count > 0 ? (
                    <div className="flex justify-between items-center  gap-8 text-center text-yellow-300 p-1 rounded-lg font-semibold w-full mx-auto ">
                      <span>
                        Please wait for 2 minutes before sending <br /> another
                        e-mail
                      </span>
                      <div>
                        <CountdownTimer />
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={sendOTPToEmail}
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none w-11/12"
                      type="button"
                    >
                      {loading && (
                        <CgSpinner size={20} className="mr-2 animate-spin" />
                      )}

                      <span>Send OTP to {currentEamil}</span>
                    </Button>
                  ))}
                {emailTakenError && (
                  <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-3/4 mx-auto ">
                    <span>{emailTakenError}</span>
                  </div>
                )}
                {otpErrorMsg && (
                  <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-3/4 mx-auto ">
                    <span>{otpErrorMsg}</span>
                  </div>
                )}
              </Modal.Footer>
            </>
          ) : (
            <>
              {/* Second part */}
              <Modal.Body>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className=" bg-gray-200 text-gray-700 text-3xl w-fit p-2 rounded-full">
                    <BsFillShieldLockFill />
                  </div>
                  <div className="flex flex-col  justify-center items-center gap-5">
                    <Label value="Enter OTP " className="text-lg" />
                    <OtpInput
                      inputStyle="mx-2 text-gray-700 w-6 text-center"
                      skipDefaultStyles="true"
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      inputType={number}
                      renderInput={(props) => <input {...props} />}
                    />
                  </div>
                  {!success && (
                    <>
                      <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-3/4 mx-auto ">
                        <span>Check your e-mail for OTP</span>
                      </div>
                      <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-3/4 mx-auto ">
                        <span>{otpErrorMsg}</span>
                      </div>
                    </>
                  )}
                </div>
              </Modal.Body>
              {!success && (
                <Modal.Footer className="flex justify-center items-center">
                  <Button
                    onClick={notGetOtp}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none w-3/5"
                    type="button"
                  >
                    <span>Didn't Get OTP?</span>
                  </Button>
                </Modal.Footer>
              )}
            </>
          )}
          {success && (
            <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-1/2 mx-auto mb-8">
              <span>Success! e-mail Verified.</span>
            </div>
          )}
        </div>
      </Modal>
    </span>
  );
};

export default ContactEamil;
