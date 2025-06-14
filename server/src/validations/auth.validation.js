import { z } from "zod";

export const signUpSchema = z
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
