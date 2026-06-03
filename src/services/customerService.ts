import CustomerModel from "../models/customerModel";

interface CustomerData {
  name: string;
  phone: string;
  address: string;
}

export class CustomerService {

  async getAllCustomers() {
    try {
      const customers = await CustomerModel.find();
      return { success: true, data: customers };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async getCustomerById(id: string) {
    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) return { success: false, error: "Customer not found" };
      return { success: true, data: customer };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async getCustomerByName(name: string) {
    try {
      const customers = await CustomerModel.find({
        name: { $regex: name, $options: "i" },
      });
      if (customers.length === 0)
        return { success: false, error: "Customer not found" }; 
      return { success: true, data: customers };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async createCustomer(customerData: CustomerData) {
    try {
      const customer = await CustomerModel.create(customerData);
      return { success: true, data: customer };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async updateCustomer(id: string, customerData: Partial<CustomerData>) {
    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) return { success: false, error: "Customer not found" };

      const updated = await CustomerModel.findByIdAndUpdate(
        id,
        customerData,
        { new: true }
      );
      return { success: true, data: updated };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  async deleteCustomer(id: string) {
    try {
      const customer = await CustomerModel.findById(id);
      if (!customer) return { success: false, error: "Customer not found" };

      await CustomerModel.findByIdAndDelete(id);
      return { success: true, data: { message: "Customer deleted successfully" } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  }
}