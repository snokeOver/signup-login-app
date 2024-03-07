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
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { TiTick } from "react-icons/ti";
import { number } from "yup";

const ContactMobile = ({ updateUserSuccess, handleUpdate }) => {
  const baseURL = "http://localhost:443";
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const auth = getAuth(app);

  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(true);
  const [success, setSuccess] = useState(false);
  const [phoneTakenError, setPhoneTakenError] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [verifyOtp, setVerifyOtp] = useState(false);

  useEffect(() => {
    const checkPhoneValidity = async (mobileNum) => {
      try {
        const response = await axios.post(`${baseURL}/check-phone`, {
          phoneNum: mobileNum,
        });
        if (response.data) {
          setValidPhone(false);
          setPhoneTakenError("This number is Taken!");
        } else {
          setValidPhone(true);
          setPhoneTakenError("");
        }
      } catch (err) {
        setValidPhone(false);
        setPhoneTakenError(err.message);
      }
    };
    const mobileNum = "+" + phone;
    if (mobileNum.length >= 14) {
      checkPhoneValidity(mobileNum);
    } else {
      setPhoneTakenError("");
      setValidPhone(false);
    }
  }, [phone]);

  const handleDbUpdate = async (phoneNumber) => {
    // postData should be configured accourding to the shcema in DB
    const postData = {
      mobileNumber: { number: phoneNumber, isVerified: true },
    };
    try {
      dispatch(userActions.updateStart());
      const response = await axios.put(
        `${baseURL}/update-user/${currentUser._id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.access_token}`,
          },
        }
      );
      if (response.data) {
        dispatch(userActions.updateSuccess(response.data));
        handleUpdate("Updated Successfully!");
        setOpenModal(false);
      } else {
        console.log("The response:", response.message);
        dispatch(userActions.UpdateFailure(response.message));
      }
    } catch (err) {
      console.log("The error Catch:", err.response.data);
      dispatch(userActions.UpdateFailure(err.response.data.message));
    }
  };

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "visible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // onSignInSubmit();
          },
        }
      );
    }
  }
  function onSignInSubmit() {
    setLoading(true);
    onCaptchaVerify();
    const appVerifier = window.recaptchaVerifier;

    const formatPhone = "+" + phone;

    signInWithPhoneNumber(auth, formatPhone, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowPhone(false);
        setOtpErrorMsg("");
      })
      .catch((error) => {
        // Error; SMS not sent
        console.log(error);
        if (error.code === "auth/too-many-requests")
          setOtpErrorMsg("Too many requests! Try after 24 hours");
        else setOtpErrorMsg("Unknown error!");
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        // console.log(res._tokenResponse.phoneNumber);
        setSuccess(true);
        setLoading(false);
        handleDbUpdate(res._tokenResponse.phoneNumber);
      })
      .catch((err) => {
        console.log(err.code);
        setOtpErrorMsg(err.code);
        setLoading(false);
      });
  }

  return (
    <span className="relative">
      <Label value="Mobile Number" />
      <TextInput
        disabled
        type="text"
        placeholder={
          !currentUser.mobileNumber.number.startsWith("rand")
            ? currentUser.mobileNumber.number
            : "Mobile Number"
        }
        id="MobileNum"
      />
      <span className="absolute right-2 top-[2rem]    ">
        {currentUser.mobileNumber.number.startsWith("rand") ? (
          <button
            className="border border-gray-400 text-xs rounded-md px-2 py-1"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            Update
          </button>
        ) : currentUser.mobileNumber.isVerified ? (
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
          <Modal.Header>Verify & Update your phone number</Modal.Header>
          <div id="recaptcha-container"></div>
          {showPhone ? (
            <>
              {/* first part */}
              <Modal.Body>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className=" bg-gray-200 text-gray-700 text-3xl w-fit p-2 rounded-full">
                    <BsTelephoneFill />
                  </div>
                  <div className="flex flex-col text-gray-700  justify-center items-center gap-5">
                    <Label
                      value="Enter your phone number"
                      className="text-lg"
                    />
                    <PhoneInput
                      type="number"
                      inputClass="text-gray-700 font-medium"
                      country={"bd"}
                      value={phone}
                      onChange={setPhone}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="flex justify-center items-center">
                {validPhone && !phoneTakenError && !otpErrorMsg && (
                  <Button
                    onClick={onSignInSubmit}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none w-3/5"
                    type="button"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mr-2 animate-spin" />
                    )}

                    <span>Send OTP via SMS</span>
                  </Button>
                )}
                {phoneTakenError && (
                  <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-3/4 mx-auto ">
                    <span>{phoneTakenError}</span>
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
                      type="number"
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
                        <span>Check your phone for OTP</span>
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
                    onClick={onOTPVerify}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none w-3/5"
                    type="button"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mr-2 animate-spin" />
                    )}

                    <span>Verify OTP</span>
                  </Button>
                </Modal.Footer>
              )}
            </>
          )}
          {success && (
            <div className="flex justify-center text-yellow-300 p-1 rounded-lg font-semibold w-1/2 mx-auto mb-8">
              <span>Success! Number Verified.</span>
            </div>
          )}
        </div>
      </Modal>
    </span>
  );
};

export default ContactMobile;
