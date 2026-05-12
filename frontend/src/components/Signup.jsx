import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import api from "@/lib/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Signup({ ...props }) {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false)
  const [input, setInput] = useState({
    username: "",
    name:"",
    email: "",
    password: "",
  });
  const { user } = useSelector((state) => state.auth);


  const handleSignup = async (e) => {
    e.preventDefault();
    setloading(true);
    console.log(input);
    try {
      const res = await api.post(
        "/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        navigate("/login")
        setInput({
          username: "",
          name:"",
          email: "",
          password: "",
        })
        console.log("Signup successful");
        toast.success(res.data.message, { position: "top-center" });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-center" });
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
      <Card className="w-full max-w-md shadow-lg " {...props}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={input.name}
                  onChange={(e) =>
                    setInput({ ...input, name: e.target.value })
                  }
                />
              </Field>
               <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Username"
                  required
                  value={input.username}
                  onChange={(e) =>
                    setInput({ ...input, username: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={input.email}
                  onChange={(e) =>
                    setInput({ ...input, email: e.target.value })
                  }
                />
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  value={input.password}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <FieldGroup>
                <Field>

                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Create Account"}
                  </Button>

                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
