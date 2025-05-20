const bcrypt = require("bcryptjs");

(async () => {
  const plainPassword = "new_password123";
  const hashedPassword = "$2b$10$FGgqC8BbWcPt6lMZPIBBl.s/1n23oIinuGxZYmmHpJHXl0AsJDQk2";

  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Manual match result:", match);
})();
