import { Request, Response } from "express";
import { CustomerService } from "../services/customerService";

const customerService = new CustomerService();

export class CustomerController {
  async getAllCustomers(req: Request, res: Response) {
    const result = await customerService.getAllCustomers();
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
  async getCustomerById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await customerService.getCustomerById(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
  async getCustomerByName(req: Request, res: Response) {
    const { name } = req.params;
    if (!name)
      return res
        .status(400)
        .json({ success: false, error: "Name is required" });

    const result = await customerService.getCustomerByName(name);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
  async createCustomer(req: Request, res: Response) {
    const result = await customerService.createCustomer(req.body);
    if (!result.success) return res.status(400).json(result);
    return res.status(201).json(result);
  }
  async updateCustomer(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await customerService.updateCustomer(id, req.body);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
  async deleteCustomer(req: Request, res: Response) {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ success: false, error: "ID is required" });
    const result = await customerService.deleteCustomer(id);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  }
}
