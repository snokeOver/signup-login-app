import { useState } from "react";
import { Card } from "flowbite-react";
import ContactMobile from "./NestedLevel2/ContactMobile";

import { HiInformationCircle } from "react-icons/hi";
import ContactEamil from "./NestedLevel2/ContactEmail";

const ProfileContact = () => {
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const handleUpdate = (newState) => {
    setUpdateUserSuccess(newState);
    // Set it to null after 3 seconds
    setTimeout(() => {
      setUpdateUserSuccess(null);
    }, 3000);
  };
  return (
    <Card>
      <div>
        <h1 className="text-2xl font-semibold">Contact</h1>
      </div>
      {updateUserSuccess && (
        <div className="flex justify-center items-center gap-3 bg-yellow-400 text-white p-2 rounded-lg font-semibold w-full lg:w-2/5 mx-auto">
          <HiInformationCircle />
          <span>{updateUserSuccess}</span>
        </div>
      )}
      <div className="flex-1 ">
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
          <ContactMobile handleUpdate={handleUpdate} />
          <ContactEamil handleUpdate={handleUpdate} />
        </div>
      </div>
    </Card>
  );
};

export default ProfileContact;
