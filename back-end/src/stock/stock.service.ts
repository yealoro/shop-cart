import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({
      relations: ['product', 'variant'],
    });
  }

  async findOne(id: number): Promise<Stock> {
    return this.stockRepository.findOne({
      where: { id },
      relations: ['product', 'variant'],
    });
  }

  async findByProduct(productId: number): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'variant'],
    });
  }

  async findByVariant(variantId: number): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { variant: { id: variantId } },
      relations: ['product', 'variant'],
    });
  }

  async create(stock: Stock): Promise<Stock> {
    return this.stockRepository.save(stock);
  }

  async update(id: number, stock: Stock): Promise<Stock> {
    await this.stockRepository.update(id, stock);
    return this.findOne(id);
  }

  async updateQuantity(id: number, quantity: number): Promise<Stock> {
    const stock = await this.findOne(id);
    stock.quantity = quantity;
    stock.lastUpdated = new Date();
    return this.stockRepository.save(stock);
  }

  async remove(id: number): Promise<void> {
    await this.stockRepository.delete(id);
  }
}