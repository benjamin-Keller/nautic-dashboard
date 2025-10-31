import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_URL || "./data.sqlite",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 Connected to SQLite database");
  } catch (error) {
    console.error("❌ Failed to connect to SQLite:", error);
  }
};
