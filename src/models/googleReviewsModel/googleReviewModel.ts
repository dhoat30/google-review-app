
import sequelize from "../../util/database";
import { Model, DataTypes, Optional } from "sequelize";
// Define the attributes of the User model
interface googleReviewAttributes {
    id: number;
    name: string;
    reviewId: string;
    reviewerPhotoUrl: string;
    review: string;
    rating: number;
    reviewOrigin: string;
    reviewerUrl: string; 
    publishAt: string; 
    publishedAtDate: string;
    UserId: number; // Add this line

  }

    // Optional fields when creating a user (e.g., ID is auto-generated)
interface GoogleReviewCreationAttributes extends Optional<googleReviewAttributes, "id"> {}

// define the sequelize google review model
class GoogleReview extends Model<googleReviewAttributes, GoogleReviewCreationAttributes> implements googleReviewAttributes {
    public id!: number;
    public name!: string;
    public reviewId!: string;
    public reviewerPhotoUrl!: string;
    public review!: string; 
    public rating!: number;
    public reviewOrigin!: string;
    public reviewerUrl!: string;
    public publishAt!: string;
    public publishedAtDate!: string;
    public UserId!: number; // Change this to number

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GoogleReview.init(
    { 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reviewId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reviewerPhotoUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    review: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewOrigin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reviewerUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publishAt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publishedAtDate: {
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
        modelName: "google-reviews", // Table name
      }
)


export default GoogleReview;
