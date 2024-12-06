const bcrypt = require("bcrypt");
const User = require("../models/authModel");



exports.registerOrLoginUser = async (req, res) => {
  const { firstName, lastName, email, password, provider } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (provider === "credentials") {
      if (!existingUser) {
        return res.status(401).json({ message: "User doesn't exist" });
      }

      // Authenticate with credentials
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT for existing user
      const token = jwt.sign(
        { email: existingUser.email, userId: existingUser.id },
        process.env.JSON_WEB_TOKEN_SECRET,
        { expiresIn: 60 * 60 * 48 }
      );

      return res.status(200).json({
        message: "User signed in successfully",
        userId: existingUser.id,
        token,
      });
    } else { 
      // Social login
      let user;
      if (existingUser) {
        user = existingUser; 
      } else {
        // Create a new user for social login
        user = await User.create({
          firstName,
          lastName,
          email,
          password, //random password for social login 
          provider,
        });
      }

      // Generate a JWT for the user (existing or new)
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        process.env.JSON_WEB_TOKEN_SECRET,
        { expiresIn: 60 * 60 * 48 }
      );

      res.status(201).json({
        message: "User registered and signed in successfully",
        userId: user.id,
        token,
      });
    }
  } catch (error) {
    console.error("Error in registerOrLoginUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Create a new user (for POST requests)
exports.postRegisterUser = async (req, res) => {
  const { firstName, lastName, email, password, provider } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password (only if not using an OAuth provider)
    const hashedPassword = provider === "credentials" ? await bcrypt.hash(password, 10) : await bcrypt.hash("temppassword", 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save hashed password
      provider,
    });

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
