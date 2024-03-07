import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              as={"div"}
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.userId.userType}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.userId.userType === "Admin" && (
            <Link to="/dashboard?tab=create-post">
              <Sidebar.Item as={"div"} active={tab === "create-post"}>
                Create Post
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item icon={HiArrowSmRight}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
