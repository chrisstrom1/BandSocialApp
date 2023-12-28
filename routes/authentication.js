let express = require("express")

let router = express.Router();

let controller = require("../controllers/authentication")

//user login
router.post("/login", controller.login);

//user register
router.post("/register", controller.register);

//list specific user
router.get("/users/:id", userController.showSpecific)

//list all users
router.get("/users", userController.listAll)

// //create new user
// router.post("/users", userController.updateExisting)

//update existing user
router.put("/users", userController.updateExisting)

//delete existing user
router.delete("/users/:id", userController.deleteUser)

module.exports = router;
