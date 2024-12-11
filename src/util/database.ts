import { Sequelize } from "sequelize";
const sequelize = new Sequelize('google-review-app', "root", "Observer13$", {dialect: 'mysql', host: 'localhost'});

export default sequelize;