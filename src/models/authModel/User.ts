import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../../util/database';

// Define the attributes of the User model
interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    provider: string;
  }
  // Optional fields when creating a user (e.g., ID is auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Define the Sequelize User model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public provider!: string;
  
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
// Initialize the model
User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize, // Pass the Sequelize instance
      modelName: "User", // Table name
    }
  );
  
  export default User;