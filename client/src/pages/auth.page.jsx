import { UserContext } from "@/App";
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
import { lookInSession, storeInSession } from "@/lib/session";
import { AuthContext } from "@/providers/auth.provider";
import { googleAuth } from "@/providers/google-auth.provider";
import {
  authSignInSchema,
  authSignUpSchema,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import googleIcon from "@/assets/icons/google.svg";

const AuthPage = ({ formType }) => {
  const { setUserAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const authForm = useForm({
    resolver: zodResolver(
      formType === "sign-in" ? authSignInSchema : authSignUpSchema
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    try {
      const result = await googleAuth();

      if (!result?.user || !result?.token) {
        toast.error("Xác thực Google thất bại.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/auth/google-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: result.token }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      toast.success("Đăng nhập Google thành công!");
      storeInSession("user", data.user);
      setUserAuth(data.user);
      navigate("/");
    } catch (err) {
      // More specific error messages
      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else if (err.message.includes("Server error")) {
        toast.error("Lỗi server: " + err.message);
      } else {
        toast.error("Xác thực Google thất bại: " + err.message);
      }
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (values) => {
      try {
        const payload =
          formType === "sign-in"
            ? {
                email: values.email,
                password: values.password,
              }
            : {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
              };

        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/auth/${formType}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        }

        return data;
      } catch (error) {
        throw new Error(error.message || "Lỗi kết nối đến máy chủ.");
      }
    },

    onSuccess: (data) => {
      toast.dismiss();

      const message =
        data.message ||
        (formType === "sign-in"
          ? "Đăng nhập thành công!"
          : "Đăng ký thành công!");

      toast.success(message);

      if (data.user?.token) {
        storeInSession("user", data.user);
        setUserAuth(data.user);
        navigate("/");
      }
    },

    onError: (error) => {
      toast.dismiss();

      const message =
        error?.message ||
        (formType === "sign-in"
          ? "Đăng nhập thất bại. Vui lòng thử lại."
          : "Đăng ký thất bại. Vui lòng thử lại.");

      toast.error(message);
    },
  });

  const onSubmit = (values) => {
    mutate(values);
  };

  useEffect(() => {
    const token = lookInSession("user")?.token;
    if (token) {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [formType, navigate]);

  return (
    <AnimationWrapper keyValue={formType}>
      <div className="min-h-screen flex items-center justify-center">
        <Form {...authForm}>
          <form
            onSubmit={authForm.handleSubmit(onSubmit)}
            className="w-[80%] max-w-[400px]"
          >
            <h1 className="text-4xl font-heading capitalize text-center mb-12">
              {formType === "sign-in" ? "Chào mừng trở lại!" : "Tham gia ngay"}
            </h1>

            <div className="flex flex-col gap-7 w-[90%] mx-auto">
              {formType !== "sign-in" && (
                <>
                  <FormField
                    control={authForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nhập tên"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={authForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên đệm</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nhập họ và tên đệm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={authForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                <FormField
                  control={authForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhập lại mật khẩu</FormLabel>
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

            <Button
              className="block w-[50%] mx-auto mt-10"
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Đang xử lý..."
                : formType === "sign-in"
                ? "Đăng nhập"
                : "Đăng ký"}
            </Button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>hoặc</p>
              <hr className="w-1/2 border-black" />
            </div>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-4 w-[90%] mx-auto"
              type="button"
              onClick={handleGoogleAuth}
              aria-disabled={isPending}
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              Tiếp tục với Google
            </Button>

            <p className="mt-6 text-dark-grey text-center">
              {formType === "sign-in" ? (
                <>
                  Chưa có tài khoản?
                  <Link to="/sign-up" className="underline text-black ml-1">
                    Đăng ký ngay
                  </Link>
                </>
              ) : (
                <>
                  Đã có tài khoản?
                  <Link to="/sign-in" className="underline text-black ml-1">
                    Đăng nhập
                  </Link>
                </>
              )}
            </p>
          </form>
        </Form>
      </div>
    </AnimationWrapper>
  );
};

export default AuthPage;
