import { z } from "zod";

export const authSignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Vui lòng nhập tên")
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(50, "Tên không được dài quá 50 ký tự")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Tên chỉ được chứa chữ cái, dấu cách, dấu nháy và gạch ngang"
      )
      .trim(),

    lastName: z
      .string()
      .min(1, "Vui lòng nhập họ")
      .min(2, "Họ phải có ít nhất 2 ký tự")
      .max(50, "Họ không được dài quá 50 ký tự")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Họ chỉ được chứa chữ cái, dấu cách, dấu nháy và gạch ngang"
      )
      .trim(),

    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Định dạng email không hợp lệ")
      .max(100, "Email không được dài quá 100 ký tự")
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(100, "Mật khẩu không được dài quá 100 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ in hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export const authSignInSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Định dạng email không hợp lệ")
    .max(100, "Email không được dài quá 100 ký tự")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được dài quá 100 ký tự"),
});
