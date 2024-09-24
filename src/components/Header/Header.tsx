import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useCheckAuth from "@/hooks/api/auth/useCheckAuth";
import { useState } from "react";
import useLogout from "@/hooks/api/auth/useLogout";
import { cn } from "@/lib/utils";
import { IoNotificationsOutline } from "react-icons/io5";
import Notifications from "../Notifications/Notifications";

export default function Header() {
  const { user } = useCheckAuth();
  const [showList, setShowList] = useState(false);
  const { logout, isPending } = useLogout();
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div className="w-full h-20 flex items-center justify-between px-10 ">
      <Link to={"/"}>
        <img src="/logo.jpg" alt="logo" className="w-20 h-20 self-start " />
      </Link>
      <div className="right-side flex  items-center justify-center gap-5">
        <div className="notifications order-1">
          <span
            className="p-2"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <IoNotificationsOutline
              size={20}
              className={cn("cursor-pointer rounded-full ", {
                "bg-slate-300": showNotifications,
              })}
            />
          </span>
          <motion.div
            className={cn(
              `drop-menu flex-col gap-3 w-32 p-2 bg-app_surface absolute right-6  z-10 rounded-md shadow-md`,
              {
                hidden: !showNotifications,
                flex: showNotifications,
              }
            )}
          >
            <div
              // onClick={() => setShowNotifications(false)}
              className="w-full h-full rounded-md  p-2   hover:bg-slate-200"
            >
              <Notifications />
            </div>
          </motion.div>
        </div>
        {user?.isAuthenticated && (
          <div className="relative">
            <img
              onClick={() => setShowList((prev) => !prev)}
              src={user?.profilePic}
              alt="profile"
              className="w-10 h-10 rounded-full shadow-md cursor-pointer"
            />

            <motion.div
              className={cn(
                `drop-menu flex-col gap-3 w-32 p-2 bg-app_surface absolute right-6  z-10 rounded-md shadow-md`,
                {
                  hidden: !showList,
                  flex: showList,
                }
              )}
            >
              <Link
                onClick={() => setShowList(false)}
                className="w-full h-full rounded-md  p-2   hover:bg-slate-200"
                to="/profile"
              >
                Profile
              </Link>
              <Link
                onClick={() => setShowList(false)}
                className="w-full h-full rounded-md  p-2   hover:bg-slate-200"
                to="/"
              >
                Home
              </Link>
              <Link
                className="w-full h-full p-2  hover:bg-slate-200 rounded-md"
                to="/"
                onClick={() => {
                  logout();
                  setShowList(false);
                }}
              >
                {isPending ? "Logging out..." : "Logout"}
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
