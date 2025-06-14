import { Bell, Pen, SearchIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { removeFromSession } from "@/lib/session";
import { AuthContext } from "@/providers/auth.provider";

const Header = () => {
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const {
    userAuth: { token, first_name, last_name, username, profile_img },
    setUserAuth,
  } = useContext(AuthContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ token: null });
  };

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

          {token && (
            <Link to={"/editor"} className="hidden md:flex gap-2 ">
              <Button variant="ghost" className="cursor-pointer">
                <Pen height={16} width={16} />
                <p>Viết bài</p>
              </Button>
            </Link>
          )}

          {token ? (
            <>
              <Link to="dashboard/notification">
                <Button
                  variant="secondary"
                  className="w-12 h-12 cursor-pointer rounded-full"
                >
                  <Bell height={16} width={16} />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-12 w-12 cursor-pointer border border-gray-100">
                    <AvatarImage src={profile_img} alt={username} />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white border border-gray-100 shadow-lg rounded-xl mt-3 w-60 p-2 right-4 md:right-[5vw]"
                  side="bottom"
                  align="end"
                >
                  <DropdownMenuLabel className="px-3 py-2 text-base">
                    {`${last_name} ${first_name}`}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-2 border-gray-100" />

                  <DropdownMenuGroup className="flex flex-col gap-1">
                    <div className="md:hidden">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/editor"
                          className="px-3 py-2 rounded-md hover:bg-gray-100 transition"
                        >
                          Viết bài
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link
                        to={`/user/${username}`}
                        className="px-3 py-2 rounded-md hover:bg-gray-100 transition"
                      >
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard/blogs"
                        className="px-3 py-2 rounded-md hover:bg-gray-100 transition"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings/edit-profile"
                        className="px-3 py-2 hover:bg-gray-100 transition"
                      >
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-2 border-gray-100" />

                  <DropdownMenuItem
                    className="text-red-600! px-3 py-2 rounded-md hover:bg-red-50 cursor-pointer transition"
                    onClick={signOutUser}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to={"/sign-in"}>
                <Button variant="default" className="cursor-pointer">
                  Đăng nhập
                </Button>
              </Link>

              <Link to={"/sign-up"} className="hidden md:block ">
                <Button variant="outline" className="cursor-pointer">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Header;
