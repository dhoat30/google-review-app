
import sequelize from "../../util/database";
import { Model, DataTypes, Optional } from "sequelize";
// Define the attributes of the User model
interface busijnessAttributes {
    id: number;
    businessName: string;
    businessMapUrl: string;
    logoUrl: string;
    UserId: number; // Add this line

  }

    // Optional fields when creating a user (e.g., ID is auto-generated)
interface BusinessCreationAttributes extends Optional<busijnessAttributes, "id"> {}

// define the sequelize google review model
class Business extends Model<busijnessAttributes, BusinessCreationAttributes> implements busijnessAttributes {
    public id!: number;
    public businessName!: string;
    public businessMapUrl!: string;
public logoUrl!:  string;
    public UserId!: number; // Change this to number
  
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Business.init(
    { 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessMapUrl: {
      type: DataTypes.STRING,
      allowNull: false
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: false
},
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: "business", // Table name
      }
)


export default Business;
