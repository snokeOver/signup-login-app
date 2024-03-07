import { useSelector } from "react-redux";
import { IoLockClosedOutline } from "react-icons/io5";

import { Button, Label, TextInput, Card } from "flowbite-react";

const ProfileAccount = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dateObj = new Date(currentUser.createdAt);
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const localTime = dateObj.toLocaleString("en-GB", options);
  // Manually convert AM/PM to uppercase
  const formattedTime = localTime.replace(/am|pm/i, (match) =>
    match.toUpperCase()
  );

  return (
    <Card>
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
      </div>
      <form className="flex-1 ">
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
          <div className="relative">
            <Label value="Username" />
            <TextInput
              type="text"
              placeholder={currentUser.user}
              id="userName"
              disabled
            />
            <span className="absolute right-2 top-[2.1rem]   text-gray-500 rounded-lg text-2xl">
              <IoLockClosedOutline />
            </span>
          </div>
          <div className="relative">
            <Label value="Registration Date" />
            <TextInput
              type="text"
              placeholder={formattedTime}
              id="joiningDate"
              disabled
            />
            <span className="absolute right-2 top-[2.1rem]   text-gray-500 rounded-lg text-2xl">
              <IoLockClosedOutline />
            </span>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProfileAccount;
