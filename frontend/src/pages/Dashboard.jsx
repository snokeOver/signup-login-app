import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../redux/userSlice";

import io from "socket.io-client";

import DashSidebar from "../components/DashSidebar";

import ProficePicture from "../components/nestedComponents/ProfilePicture";
import ProfileAccount from "../components/nestedComponents/ProfileAccount";
import ProfileContact from "../components/nestedComponents/ProfileContact";

const Dashboard = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    // Create a new socket connection when the component mounts
    const socket = io("http://localhost:3000");

    // Connect when component mounts
    socket.on("connect", () => {
      // console.log("Connected to socket");

      // Send the user ID to the server
      socket.emit("userId", currentUser._id); // Replace "user123" with the actual user ID
    });

    // Listen for data changes emitted from the backend
    socket.on("dataChange", (change) => {
      dispatch(userActions.updateSuccess(change));
      // Handle the change as needed, update state, trigger a re-render, etc.
    });

    // Disconnect when component unmounts
    return () => {
      socket.disconnect();
      // console.log("Disconnected from socket");
    };
  }, []);

  return (
    <div className=" min-h-screen flex flex-col md:flex-row">
      {/* Left side */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Right side */}
      <div className="flex w-full justify-center p-4 md:p-8">
        {tab === "profile" && (
          <div className="flex flex-col gap-4  w-full">
            {/* Profile Picture */}
            <ProficePicture />

            <div className=" flex flex-col gap-6 w-full">
              {/* Account Part */}
              <ProfileAccount />
              <ProfileContact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
