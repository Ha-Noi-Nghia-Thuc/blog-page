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

const AuthPage = ({ formType }) => {
  const { setUserAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const isSignIn = formType === "sign-in";

  const form = useForm({
    resolver: zodResolver(isSignIn ? authSignInSchema : authSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Google Auth Handler
  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    try {
      const result = await googleAuth();
      if (!result?.user || !result?.token) {
        throw new Error("Không thể xác thực với Google. Vui lòng thử lại.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/auth/google-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: result.token }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại."
        );
      }

      toast.success("Đăng nhập bằng Google thành công!");
      storeInSession("user", data.user);
      setUserAuth(data.user);
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);

      if (error.message.includes("popup-closed-by-user")) {
        toast.error("Bạn đã đóng cửa sổ đăng nhập.");
      } else if (error.message.includes("popup-blocked")) {
        toast.error(
          "Trình duyệt của bạn đã chặn cửa sổ đăng nhập pop-up. Vui lòng kiểm tra cài đặt trình duyệt."
        );
      } else if (error.message.includes("cancelled-popup-request")) {
        toast.error("Yêu cầu đăng nhập đã bị hủy.");
      } else {
        toast.error(
          error.message ||
            "Có lỗi xảy ra khi đăng nhập bằng Google. Vui lòng thử lại sau."
        );
      }
    }
  };

  // Form Submission
  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (values) => {
      const endpoint = isSignIn ? "sign-in" : "sign-up";
      const payload = isSignIn
        ? { email: values.email, password: values.password }
        : {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          };

      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }

      return data;
    },
    onSuccess: (data) => {
      const message = isSignIn
        ? "Bạn đã đăng nhập thành công!"
        : "Tài khoản của bạn đã được tạo thành công!";
      toast.success(message);

      if (data.user?.token) {
        storeInSession("user", data.user);
        setUserAuth(data.user);
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Auth error:", error);
      toast.error(
        error.message ||
          "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại."
      );
    },
  });

  const onSubmit = (values) => {
    submitForm(values);
  };

  useEffect(() => {
    const token = lookInSession("user")?.token;
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <AnimationWrapper keyValue={formType}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Form Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              {isSignIn ? "Chào mừng trở lại!" : "Chào mừng bạn gia nhập!"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isSignIn
                ? "Đăng nhập để tiếp tục hành trình của bạn."
                : "Tạo tài khoản để bắt đầu khám phá và chia sẻ."}
            </p>
          </div>

          {/* Form Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!isSignIn && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: An" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và Tên đệm</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: Nguyễn Văn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Địa chỉ email của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu của bạn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập lại mật khẩu để xác nhận"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? "Đang xử lý..."
                  : isSignIn
                  ? "Đăng nhập"
                  : "Tạo tài khoản"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={handleGoogleAuth}
                disabled={isPending}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Tiếp tục với Google
              </Button>
            </form>
          </Form>
          <p className="mt-8 text-center text-sm text-gray-600">
            {isSignIn ? (
              <>
                Chưa có tài khoản?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Đăng ký ngay!
                </Link>
              </>
            ) : (
              <>
                Bạn đã có tài khoản?{" "}
                <Link
                  to="/sign-in"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Đăng nhập tại đây.
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </AnimationWrapper>
  );
};

export default AuthPage;
