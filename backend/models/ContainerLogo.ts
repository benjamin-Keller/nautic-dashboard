import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class ContainerLogo extends Model {
  declare id: number;
  declare imageName: string;
  declare logoUrl: string;
}

ContainerLogo.init(
  {
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ContainerLogo",
    tableName: "container_logos",
  }
);
