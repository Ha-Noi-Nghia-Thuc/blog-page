import { z } from "zod";

export const authSignUpSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("Vui lòng nhập tên")
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được dài quá 50 ký tự")
      .regex(/^[\p{L}\s'-]+$/u, "Tên không hợp lệ"),

    lastName: z
      .string()
      .nonempty("Vui lòng nhập họ và tên đệm")
      .min(2, "Họ và tên đệm phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên đệm không được dài quá 50 ký tự")
      .regex(/^[\p{L}\s'-]+$/u, "Họ và tên đệm không hợp lệ"),

    email: z
      .string()
      .nonempty("Vui lòng nhập email")
      .email("Email không hợp lệ"),

    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100, "Mật khẩu không được vượt quá 100 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),

    confirmPassword: z.string().nonempty("Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });

export const authSignInSchema = z.object({
  email: z.string().nonempty("Vui lòng nhập email").email("Email không hợp lệ"),

  password: z
    .string()
    .nonempty("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
});
