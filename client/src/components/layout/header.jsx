import { Pen, SearchIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Header = () => {
  const [openSearchBox, setOpenSearchBox] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="z-10 sticky top-0 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-gray-100 bg-white">
        {/* Logo */}
        <Link to="/" className="flex-none w-auto">
          <span className="text-2xl font-bold font-heading">
            Hà Nội Nghĩa Thục
          </span>
        </Link>

        {/* Search Box */}
        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray-100 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto  ${
            openSearchBox ? "show" : "hide"
          } md:show`}
        >
          <Input
            type="text"
            placeholder="Tìm bài viết"
            className="w-full md:w-auto bg-gray-100 p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-gray-500 md:pl-12"
          />

          <SearchIcon
            height={16}
            width={16}
            className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl text-gray-500 cursor-pointer"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <Button
            variant="secondary"
            className="md:hidden w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setOpenSearchBox((currentVal) => !currentVal)}
          >
            <SearchIcon height={16} width={16} className="text-gray-500" />
          </Button>

          <Link to={"/editor"} className="hidden md:flex gap-2 ">
            <Button variant="ghost" className="cursor-pointer">
              <Pen height={16} width={16} />
              <p>Viết</p>
            </Button>
          </Link>

          <Link to={"/sign-in"}>
            <Button variant="default" className="cursor-pointer">
              Đăng nhập
            </Button>
          </Link>

          <Link to={"/sign-up"} className="hidden md:block ">
            <Button variant="secondary" className="cursor-pointer">
              Đăng ký
            </Button>
          </Link>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Header;
