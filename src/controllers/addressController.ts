import type { Request, Response } from 'express';
import { AddressService } from '../services/addressService';

const addressService = new AddressService();

export class AddressController {
  async createAddress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const addressData = req.body;

      const user = await addressService.createAddress(id, addressData);
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Não foi possível criar endereço" });
    }
  }
  async updateAddress(req: Request, res: Response) {
    try {
      const { id, addressId } = req.params;
      const addressData = req.body;

      const user = await addressService.updateAddress(id, addressId, addressData);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Não foi possível alterar endereço" });
    }
  }

  async removeAddress(req: Request, res: Response) {
    try {
      const { id, addressId } = req.params;

      const user = await addressService.deleteAddress(id, addressId);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Não foi possível remover endereço" });
    }
  }

  async getAddresses(req: Request, res: Response) {
    try {
      const user = await addressService.getAddressesByUserId(req.query.id);
      console.log(user);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Não foi possível retornar endereços" });
    }
  }
}