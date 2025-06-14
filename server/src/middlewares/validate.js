export const validate = (schema) => async (req, res, next) => {
  try {
    // Validate and transform request body
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    console.error("Validation error:", error);

    // Format Zod errors for client
    const formattedErrors =
      error.errors?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })) || [];

    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: formattedErrors,
    });
  }
};
