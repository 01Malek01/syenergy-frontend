import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useLogin from "@/hooks/api/useLogin";
import useSignup from "@/hooks/api/useSignup";
import useGoogleLogin from "@/hooks/api/useGoogleLogin";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
// .required({
//   username: "Username is required",
//   email: "Email is required",
//   password: "Password is required",
//   confirmPassword: "Confirm Password is required",
// });
function SignUp() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login, isPending: loginPending } = useLogin();
  const { googleLogin } = useGoogleLogin();
  const { signup, isPending: signupPending } = useSignup();
  const [overlayMove, setOverlayMove] = useState(false);
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleLogin = (data) => {
    console.log(data);
    login(data);
  };
  const handleSignup = (data) => {
    console.log(data);
    signup(data);
  };

  return (
    <div className="wrapper w-full h-screen justify-center items-center flex">
      <div className="container w-full h-full flex flex-row  justify-between items-center p-10 bg-gradient-to-r bg-surface shadow-xl relative">
        <motion.div
          whileInView={{ x: overlayMove ? 0 : "100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-1/2 h-full  top-0 left-0 bg-app_secondary"
        ></motion.div>
        {/* signup words */}
        <div
          className={cn(
            "flex-1  h-full left-side z-10 m-10 flex flex-col gap-4 items-center justify-center order-1",
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
          {/* signup */}
        </div>

        {/* login words */}
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

        {/* signup form */}
        <div
          className={cn(
            "flex-1  h-full p-10 pt-auto flex items-center z-10 sign-up  flex-col",
            {
              flex: !overlayMove,
              hidden: overlayMove,
            }
          )}
        >
          <Form {...form}>
            <motion.form
              transition={{ duration: 0.5, ease: "easeInOut" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="w-full flex items-center justify-center gap-5 flex-col"
              onSubmit={handleSubmit(handleSignup)}
            >
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter your username"
                      />
                    </FormControl>
                    <FormMessage>{errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Confirm your password"
                      />
                    </FormControl>
                    <FormMessage>{errors.confirmPassword?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button
                onClick={handleSignup}
                className="w-1/2 bg-app_primary hover:bg-blue-700"
                type="submit"
              >
                Sign Up
              </Button>
              <span className="text-1xl font-semibold">Or</span>
            </motion.form>
          </Form>
          <Button
            onClick={() => {
              window.location.href = `${backendUrl}/auth/login/federated/google`;
              googleLogin();
            }}
            className="w-1/2 text-app_text hover:bg-slate-200 bg-white mt-3"
          >
            Sign Up with Google <FcGoogle size={20} />
          </Button>
        </div>
        {/* login form */}
        <div
          className={cn(
            "flex-1  h-full p-10 pt-auto flex items-center z-10 m-5",
            {
              flex: overlayMove,
              hidden: !overlayMove,
            }
          )}
        >
          <Form {...form}>
            <motion.form
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full flex items-center justify-center gap-5 flex-col"
              onSubmit={handleSubmit(handleLogin)}
            >
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage>{errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                className="w-1/2 bg-app_primary hover:bg-blue-700"
                type="submit"
              >
                Login
              </Button>
            </motion.form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
