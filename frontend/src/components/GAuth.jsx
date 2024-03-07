import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const GAuth = () => {
  const baseURL = "http://localhost:443";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  const handleGauthBtn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const postData = {
        user: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        profilePic: resultFromGoogle.user.photoURL,
      };
      console.log(postData);
      const response = await axios.post(`${baseURL}/g-auth`, postData);
      console.log(response);
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
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={() => handleGauthBtn()}
    >
      <AiFillGoogleCircle className=" w-6 h-6 mr-2 " /> Continue with Google
    </Button>
  );
};

export default GAuth;
