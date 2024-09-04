import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Login from "@/components/Login"; // Assuming it's in the same directory
import Signup from "@/components/SignUp"; // Assuming it's in the same directory

function Auth() {
  const [overlayMove, setOverlayMove] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="wrapper w-full h-screen justify-center items-center flex">
      <div className="container w-full h-full flex flex-row justify-between items-center p-10 bg-gradient-to-r bg-surface shadow-xl relative">
        <motion.div
          whileInView={{ x: overlayMove ? 0 : "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-1/2 h-full top-0 left-0 bg-app_secondary"
        ></motion.div>

        {/* Signup side */}
        <div
          className={cn(
            "flex-1 h-full left-side z-10 m-10 flex flex-col gap-4 items-center justify-center order-1",
            {
              flex: !overlayMove,
              hidden: overlayMove,
            }
          )}
        >
          <h1 className="font-extrabold text-5xl">
            Welcome to <span className="text-blue-500">Synergy</span>!
          </h1>
          <span className="text-1xl font-medium shadow-text tracking-tight">
            SignUp and discover your community.
          </span>
          <Button
            onClick={() => setOverlayMove((prev) => !prev)}
            className="mt-5 rounded-lg bg-app_primary hover:bg-blue-700"
          >
            Login
          </Button>
        </div>

        {/* Login side */}
        <div
          className={cn(
            "flex-1 h-full left-side flex flex-col gap-4 items-center justify-center z-10 p-10",
            {
              flex: overlayMove,
              hidden: !overlayMove,
            }
          )}
        >
          <h1 className="font-extrabold text-5xl">Welcome Back!</h1>
          <span className="text-1xl font-medium shadow-text tracking-tight">
            Login Now and continue the fun with{" "}
            <span className="text-blue-500 font-semibold text-md">Synergy</span>
            !
          </span>
          <Button
            onClick={() => setOverlayMove((prev) => !prev)}
            className="mt-5 rounded-lg bg-app_primary hover:bg-blue-700"
          >
            Sign Up
          </Button>
        </div>

        {/* Signup Form */}
        <Signup overlayMove={overlayMove} backendUrl={backendUrl} />

        {/* Login Form */}
        <Login overlayMove={overlayMove} backendUrl={backendUrl} />
      </div>
    </div>
  );
}

export default Auth;
