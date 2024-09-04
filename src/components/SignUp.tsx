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
import useSignup from "@/hooks/api/useSignup";
import useGoogleLogin from "@/hooks/api/useGoogleLogin";
import { cn } from "@/lib/utils";
import { Navigate, useNavigate } from "react-router-dom";

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

const SignupForm = ({ overlayMove, backendUrl }) => {
  const navigate = useNavigate();
  const { signup, isSuccess } = useSignup();
  const { googleLogin } = useGoogleLogin();
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

  const handleSignup = (data) => {
    signup(data);
    if (isSuccess) {
      navigate("/auth");
    }
  };

  return (
    <div
      className={cn(
        "flex-1 h-full p-10 pt-auto flex items-center z-10 sign-up flex-col",
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
            className="w-1/2 bg-app_primary hover:bg-blue-700"
            type="submit"
          >
            Sign Up
          </Button>
        </motion.form>
      </Form>
      <motion.div
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        className="text-center flex items-center gap-5"
      >
        <Button
          className="bg-white rounded-full px-4 py-2 text-black hover:bg-gray-200 mt-5"
          onClick={() => {
            window.location.href = `${backendUrl}/auth/login/federated/google`;
            googleLogin();
          }}
        >
          <FcGoogle size={24} className="mr-2" />
          Continue with Google
        </Button>
      </motion.div>
    </div>
  );
};

export default SignupForm;
