import { Card } from "flowbite-react";
import { useSelector } from "react-redux";

const ProficePicture = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Card>
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col items-center">
        <div className="w-32 h-32 cursor-pointer">
          <img
            src={currentUser.profilePic}
            alt=""
            className="rounded-full w-full h-full border-8 border-gray-300 object-cover"
          />
        </div>
      </form>
    </Card>
  );
};

export default ProficePicture;
