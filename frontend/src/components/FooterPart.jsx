import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

const FooterPart = () => {
  return (
    <Footer
      container
      className="rounded-t-[2.5rem]  border-t-2 border-teal-500 shadow-none"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
          {/* Logo part */}
          <div className=" flex justify-center">
            <Link
              to="/"
              className="self-center text-lg sm:text-xl font-semibold dark:text-white "
            >
              <span className="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ">
                Snoke's
              </span>
              Blog
            </Link>
          </div>
          {/* Link Group Part */}
          <div className="flex md:gap-24 justify-between ">
            {/* Part 1 */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Googly
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* Part 2 */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Googly
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* Part 3 */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Googly
                </Footer.Link>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer">
                  Github
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Snoke's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className=" w-full flex flex-col md:flex-row  items-center md:justify-between">
          <Footer.Copyright
            href="#"
            by="Snoke's Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-5 md:mt-0">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterPart;
