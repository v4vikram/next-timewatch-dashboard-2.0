"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { loginUser } from "@/services/authService";

import { LoginSchema } from "@/validationSchema/userFormSchema";
import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const router = useRouter()

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    if (values.email === email && values.password === password) {
      localStorage.setItem("userLogin", process.env.NEXT_PUBLIC_TOKEN)
      toast.error("Login Successfully", { className: "success" });
      // resetForm();
      router.push('/dashboard')
      // console.log(values);
    } else {
      toast.error("Login failed invalid credentials", { className: "error" });
      console.error("Login failed invalid credentials");
      
    }
  }

  return (
    // <RedirectIfAuthenticated>
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md bg-gray-100 border-0">
        <CardHeader>
          <CardTitle className="text-3xl text-neon-green font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-5">
                {[
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "you@example.com",
                  },
                  {
                    name: "password",
                    label: "Password",
                    type: "password",
                    placeholder: "••••••••",
                  },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name} className="">
                    <Label htmlFor={name} className="">
                      {label}
                    </Label>
                    <Field
                      as={Input}
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      autoComplete={
                        name === "password" ? "current-password" : name
                      }
                      className=""
                    />
                    <ErrorMessage
                      name={name}
                      component="p"
                      className="text-sm text-red-400"
                    />
                  </div>
                ))}

                {status && <p className="text-sm text-red-400">{status}</p>}

                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          {/* <Button
              onClick={handleGoogleLogin}
              className="w-full mt-4 bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 border"
              type="button"
            >
              <Image src={googleIcon} alt="Google" width={20} height={20} />
              <span>Login with Google</span>
            </Button> */}
        </CardContent>
        {/* <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-neon-green"
              >
                Sign up
              </Link>
            </p>
          </CardFooter> */}
      </Card>
    </div>
    // </RedirectIfAuthenticated>
  );
}
