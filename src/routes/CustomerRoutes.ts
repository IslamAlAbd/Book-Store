import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";

const router = Router();
const customerController = new CustomerController();

router.get("/", (req, res) => customerController.getAllCustomers(req, res));
router.get("/search", (req, res) =>
  customerController.getCustomerByName(req, res),
);
router.get("/:id", (req, res) => customerController.getCustomerById(req, res));
router.post("/", (req, res) => customerController.createCustomer(req, res));
router.put("/:id", (req, res) => customerController.updateCustomer(req, res));
router.delete("/:id", (req, res) =>
  customerController.deleteCustomer(req, res),
);

export default router;
