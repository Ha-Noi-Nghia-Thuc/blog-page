import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }

    const options = {
      autoIndex: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    const connection = await mongoose.connect(
      process.env.DATABASE_URL,
      options
    );

    console.log(`Database connected: ${connection.connection.host}`);
    console.log(`Database name: ${connection.connection.name}`);

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("Database connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Database disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("Database reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("Database connection closed through app termination");
        process.exit(0);
      } catch (error) {
        console.error("Error during database shutdown:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
