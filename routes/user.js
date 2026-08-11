// const express = require("express");
// const router = express.Router();
// const { userById, read, getAllUsers, signup } = require("../controllers/user");

// router.get("/", getAllUsers)

// router.get("/:userId", read);

// router.param("userId", userById);
// module.exports = router;

const express = require("express");
const router = express.Router();
const { 
  userById, 
  read, 
  getAllUsers, 
  updateUser, 
  changePassword 
} = require("../controllers/user");

const { requireUserSignin } = require("../controllers/auth-user");

// Static routes MUST come before /:userId parameter routes
router.get("/", getAllUsers);
router.put("/update", requireUserSignin, updateUser);
router.put("/change-password", requireUserSignin, changePassword);

// Parameter routes
router.get("/:userId", read);

router.param("userId", userById);

module.exports = router;