const express = require("express");
const router = express.Router();
employeesController = require("../../Controllers/employeesController");
const ROLES_LIST = require('../../Config/role_list');
const verifyRoles = require("../../Middleware/verifyRoles");
router
  .route("/")

  .get(employeesController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
