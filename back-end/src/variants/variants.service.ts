import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(variant: any): Promise<Variant> {
    // Mapeo automático: si llega productId, construimos la relación product
    const payload = { ...variant };
    if (payload.productId && !payload.product) {
      payload.product = { id: payload.productId } as any;
    }

    const entity = this.variantsRepository.create({
      product: payload.product,
      size: payload.size ?? null,
      color: payload.color ?? null,
      material: payload.material ?? null,
      stock: payload.stock ?? 0,
    });
    return this.variantsRepository.save(entity);
  }

  async update(id: number, variant: any): Promise<Variant> {
    const payload = { ...variant };
    if (payload.productId && !payload.product) {
      payload.product = { id: payload.productId } as any;
    }

    // preload combina el id con el objeto parcial y carga la entidad existente
    const entity = await this.variantsRepository.preload({
      id,
      product: payload.product,
      size: payload.size ?? undefined,
      color: payload.color ?? undefined,
      material: payload.material ?? undefined,
      stock: payload.stock ?? undefined,
    });

    if (!entity) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }

    return this.variantsRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.variantsRepository.delete(id);
  }
}