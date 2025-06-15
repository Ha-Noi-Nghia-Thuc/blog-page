import { removeFromSession } from "@/lib/session";
import { AuthContext } from "@/providers/auth.provider";
import { Bell, Pen, Search } from "lucide-react";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    userAuth: { token, first_name, last_name, username, profile_img },
    setUserAuth,
  } = useContext(AuthContext);

  const handleSignOut = () => {
    removeFromSession("user");
    setUserAuth({
      token: null,
      first_name: "",
      last_name: "",
      username: "",
      profile_img: "",
    });
  };

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  return (
    <>
      <nav className="sticky top-0 z-10 flex items-center gap-12 w-full px-[5vw] py-5 h-20 border-b border-gray-100 bg-white">
        {/* Logo */}
        <Link to="/" className="flex-none">
          <span className="text-2xl font-bold font-heading text-gray-900">
            Hà Nội Nghĩa Thục
          </span>
        </Link>

        {/* Search Box */}
        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray-100 py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto transition-all duration-200 ${
            isSearchOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
          }`}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full md:w-auto bg-gray-50 pl-12 pr-4 py-3 rounded-full border-0 placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSearch}
          >
            <Search className="w-4 h-4" />
          </Button>

          {token ? (
            <>
              {/* Write Button */}
              <Link to="/editor" className="hidden md:flex">
                <Button variant="ghost" className="gap-2">
                  <Pen className="w-4 h-4" />
                  Viết bài
                </Button>
              </Link>

              {/* Notifications */}
              <Link to="/dashboard/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors">
                    <AvatarImage
                      src={profile_img || "/placeholder.svg?height=40&width=40"}
                      alt={username || "User avatar"}
                    />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 mt-2" align="end">
                  <DropdownMenuLabel className="font-medium">
                    {`${last_name} ${first_name}`.trim() || "Người dùng"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <div className="md:hidden">
                      <DropdownMenuItem asChild>
                        <Link to="/editor" className="cursor-pointer">
                          <Pen className="w-4 h-4 mr-2" />
                          Viết bài
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link to={`/user/${username}`} className="cursor-pointer">
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/blogs" className="cursor-pointer">
                        Bảng điều khiển
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/settings/edit-profile"
                        className="cursor-pointer"
                      >
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button>Đăng nhập</Button>
              </Link>
              <Link to="/sign-up" className="hidden md:block">
                <Button variant="outline">Đăng ký</Button>
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
