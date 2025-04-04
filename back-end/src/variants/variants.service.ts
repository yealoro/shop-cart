import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './variant.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,
  ) {}

  async findAll(): Promise<Variant[]> {
    return this.variantsRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<Variant> {
    return this.variantsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<Variant[]> {
    return this.variantsRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create(variant: Variant): Promise<Variant> {
    return this.variantsRepository.save(variant);
  }

  async update(id: number, variant: Variant): Promise<Variant> {
    await this.variantsRepository.update(id, variant);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.variantsRepository.delete(id);
  }
}