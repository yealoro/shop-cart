import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion, DiscountType } from './promotion.entity';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async findAll(): Promise<Promotion[]> {
    return this.promotionsRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<Promotion> {
    return this.promotionsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<Promotion[]> {
    return this.promotionsRepository.find({
      where: {
        product: { id: productId },
        isActive: true,
      },
      relations: ['product'],
    });
  }

  async findActivePromotions(): Promise<Promotion[]> {
    const currentDate = new Date();
    return this.promotionsRepository.find({
      where: {
        isActive: true,
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
      },
      relations: ['product'],
    });
  }

  async create(promotion: Promotion): Promise<Promotion> {
    return this.promotionsRepository.save(promotion);
  }

  async update(id: number, promotion: Promotion): Promise<Promotion> {
    await this.promotionsRepository.update(id, promotion);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.promotionsRepository.delete(id);
  }

  // Método para calcular el precio final con promoción
  calculateFinalPrice(basePrice: number, promotion: Promotion): number {
    if (!promotion) return basePrice;
    
    if (promotion.discountType === DiscountType.PERCENTAGE) {
      return basePrice * (1 - promotion.discountValue / 100);
    } else {
      return Math.max(0, basePrice - promotion.discountValue);
    }
  }
}