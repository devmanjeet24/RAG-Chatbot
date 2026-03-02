const validateRegister = (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw { status: 400, message: "All fields are required" };
  }

  if (password.length < 6) {
    throw { status: 400, message: "Password must be at least 6 characters" };
  }
};

const validateLogin = (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }
};

module.exports = {
  validateRegister,
  validateLogin,
};