import type { Request, Response } from 'express';
import { PaymentService } from '@/services/paymentService';

const paymentService = new PaymentService();

export class PaymentController {
  async create(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentMethod = req.body;

      const newPaymentMethod =
        await paymentService.createPaymentMethod(id, paymentMethod);
      
      res.status(201).json(newPaymentMethod);
    } catch (error) {
      res.status(400).json({ message: "Não foi possível criar método de pagamento" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id, paymentId } = req.params;

      const user = await paymentService.deletePaymentMethod(id, paymentId);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "Não foi possível remover método de pagamento" });
    }
  }
}