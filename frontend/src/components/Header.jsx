import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { themeActions } from "../redux/themeSlice";
import { userActions } from "../redux/userSlice";

const Header = () => {
  const baseURL = "http://localhost:443";
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignOut = async () => {
    try {
      const response = await axios.post(`${baseURL}/sign-out`);
      if (response.data) {
        dispatch(userActions.signOutSuccess());
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center text-sm sm:text-xl font-semibold dark:text-white "
      >
        <span className="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
          Snoke's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          id="text"
          type="text"
          placeholder="Search...."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className=" lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-1">
        <Button
          className="hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(themeActions.toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <div>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar img={currentUser.profilePic} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.user}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.userEmail.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Link onClick={handleSignOut}>
                <Dropdown.Item>Sign Out</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "#"} as={"div"}>
          <Link to="#">About</Link>
        </Navbar.Link>
        {currentUser ? (
          <></>
        ) : (
          <Navbar.Link active={path === "/sign-up"} as={"div"}>
            <Link to="/sign-up">Sign Up</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
