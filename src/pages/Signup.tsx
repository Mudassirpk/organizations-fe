import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    organizationName: "",
  });
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const { mutate, status } = useMutation({
    async mutationFn() {
      return (
        await axios.post("http://localhost:3000/auth/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          organizationName: data.organizationName,
        })
      ).data;
    },
    onSuccess(data) {
      if (data.success) {
        toast.success("Account created successfully");
        setData({
          name: "",
          email: "",
          password: "",
          cpassword: "",
          organizationName: "",
        });

        navigate("/login");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log(data);
        if (data.password !== data.cpassword) {
          toast.error(`Passwords doesn't match`);
        } else {
          mutate();
        }
      }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800 ml-2">
              Organizations
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              id="name"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
              id="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name</Label>
            <Input
              value={data.organizationName}
              onChange={(e) => {
                setData({ ...data, organizationName: e.target.value });
              }}
              id="organization"
              type="text"
              placeholder="My Organization..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="cpassword"
                value={data.cpassword}
                onChange={(e) => {
                  setData({ ...data, cpassword: e.target.value });
                }}
                type={showCPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => {
                  setShowCPassword(!showCPassword);
                }}
                aria-label={showCPassword ? "Hide password" : "Show password"}
              >
                {showCPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            disabled={status === "pending"}
            className="disabled:cursor-not-allowed w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create account
          </Button>
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
