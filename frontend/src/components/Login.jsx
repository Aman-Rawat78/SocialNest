import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { use, useEffect, useState } from "react";
import api from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(input);
    setloading(true);
    try {
      const res = await api.post(
        "/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        navigate("/");
        setInput({
          email: "",
          password: "",
        });
       
        toast.success(res.data.message, { position: "top-center" });
        dispatch(setAuthUser(res.data.user));
       
        
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message, { position: "top-center" });
    } finally {
      setloading(false);
    }
  };

   useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className={cn("flex flex-col  w-full max-w-md shadow-lg p-4 ")}
        onSubmit={handleLogin}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-background"
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
            />
          </Field>
          <Field>
            <div className="flex items-center ">
              <FieldLabel htmlFor="password">Password</FieldLabel>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="bg-background"
              value={input.password}
              onChange={(e) => setInput({ ...input, password: e.target.value })}
            />
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ?  <Loader2 className="animate-spin mr-2" /> :  "Log in"  }
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="/Signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
