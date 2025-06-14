import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AnimationWrapper from "@/lib/animation-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const AuthPage = ({ formType }) => {
  const authFormSchema = z
    .object({
      firstName: z
        .string()
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên không được dài quá 50 ký tự")
        .regex(/^[\p{L}\s'-]+$/u, "Tên không hợp lệ"),
      lastName: z
        .string()
        .min(2, "Họ và tên đệm phải có ít nhất 2 ký tự")
        .max(50, "Họ và tên đệm không được dài quá 50 ký tự")
        .regex(/^[\p{L}\s'-]+$/u, "Họ và tên đệm không hợp lệ"),
      email: z.string().email("Email không hợp lệ"),

      password: z
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(100, "Mật khẩu không được vượt quá 100 ký tự")
        .regex(/[a-z]/, "Phải có ít nhất 1 chữ thường")
        .regex(/[A-Z]/, "Phải có ít nhất 1 chữ in hoa")
        .regex(/[0-9]/, "Phải có ít nhất 1 chữ số")
        .regex(/[^a-zA-Z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt"),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Mật khẩu nhập lại không khớp",
    });

  const authForm = useForm({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formType]);

  return (
    <AnimationWrapper keyValue={formType}>
      <div className="min-h-screen flex items-center justify-center">
        <Form {...authForm}>
          <form className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-heading capitalize text-center mb-12">
              {formType === "sign-in" ? "Welcome back!" : "Join us today"}
            </h1>

            {/* Form Fields */}
            <div className="flex flex-col gap-7 w-[80%] mx-auto">
              {formType !== "sign-in" && (
                <>
                  {/* First name field */}
                  <FormField
                    control={authForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Tên</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nhập Tên"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Last name field */}
                  <FormField
                    control={authForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và Tên đệm</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nhập Họ và Tên đệm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Email field */}
              <FormField
                control={authForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập địa chỉ Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={authForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formType !== "sign-in" && (
                /* Confirm password field */
                <FormField
                  control={authForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhập lại Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button className="block w-[50%] mx-auto mt-10" type="submit">
              {formType === "sign-in" ? "Đăng nhập" : "Đăng ký"}
            </Button>

            {/* Separator */}
            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>hoặc</p>
              <hr className="w-1/2 border-black" />
            </div>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-4 w-[90%] mx-auto"
            >
              Continue With Google
            </Button>

            {formType === "sign-in" ? (
              <p className="mt-6 text-dark-grey text-center">
                Chưa có tài khoản?{" "}
                <Link to="/sign-up" className="underline text-black ml-1">
                  Đăng ký ngay
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-center">
                Đã có tài khoản?{" "}
                <Link to="/sign-in" className="underline text-black ml-1">
                  Đăng nhập
                </Link>
              </p>
            )}
          </form>
        </Form>
      </div>
    </AnimationWrapper>
  );
};

export default AuthPage;
