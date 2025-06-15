import { z } from "zod";

export const authSignUpSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("Vui lòng nhập tên của bạn.")
      .min(2, "Tên của bạn phải có ít nhất 2 ký tự.")
      .max(50, "Tên của bạn không được dài quá 50 ký tự.")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Tên của bạn chỉ có thể chứa chữ cái, dấu cách, dấu gạch ngang hoặc dấu nháy đơn."
      ),

    lastName: z
      .string()
      .nonempty("Vui lòng nhập họ và tên đệm của bạn.")
      .min(2, "Họ và tên đệm của bạn phải có ít nhất 2 ký tự.")
      .max(50, "Họ và tên đệm của bạn không được dài quá 50 ký tự.")
      .regex(
        /^[\p{L}\s'-]+$/u,
        "Họ và tên đệm của bạn chỉ có thể chứa chữ cái, dấu cách, dấu gạch ngang hoặc dấu nháy đơn."
      ),

    email: z
      .string()
      .nonempty("Vui lòng nhập địa chỉ email của bạn.")
      .email("Địa chỉ email bạn nhập không hợp lệ. Vui lòng kiểm tra lại."),

    password: z
      .string()
      .nonempty("Vui lòng nhập mật khẩu của bạn.")
      .min(8, "Mật khẩu của bạn phải có ít nhất 8 ký tự.")
      .max(100, "Mật khẩu của bạn không được dài quá 100 ký tự.")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái thường.")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa.")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
      .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt."),

    confirmPassword: z
      .string()
      .nonempty("Vui lòng xác nhận lại mật khẩu của bạn."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message:
      "Mật khẩu xác nhận không khớp với mật khẩu đã nhập. Vui lòng thử lại.",
  });

export const authSignInSchema = z.object({
  email: z
    .string()
    .nonempty("Vui lòng nhập địa chỉ email của bạn.")
    .email("Địa chỉ email bạn nhập không hợp lệ. Vui lòng kiểm tra lại."),

  password: z
    .string()
    .nonempty("Vui lòng nhập mật khẩu của bạn.")
    .min(8, "Mật khẩu của bạn phải có ít nhất 8 ký tự.")
    .max(100, "Mật khẩu của bạn không được dài quá 100 ký tự."),
});
