import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private promotionsService: PromotionsService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category', 'variants', 'images', 'promotions'],
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'variants', 'images', 'promotions'],
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'images', 'promotions'],
    });
  }

  async findBySlug(slug: string): Promise<Product | undefined> {
    const products = await this.productsRepository.find({
      where: { slug: slug },
      relations: ['category', 'variants', 'images', 'promotions'],
    });
    return products[0]; // Return the first found product or undefined
  }

  async create(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  }

  async update(id: number, product: Product): Promise<Product> {
    await this.productsRepository.update(id, product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  // Método para calcular el precio final considerando descuentos y promociones
  async calculateFinalPrice(productId: number, quantity: number = 1): Promise<number> {
    const product = await this.findOne(productId);
    if (!product) return 0;

    // Verificar si aplica precio mayorista
    if (quantity >= product.wholesaleMinQuantity && product.wholesalePrice) {
      return product.wholesalePrice;
    }

    // Verificar si hay promociones activas
    const activePromotions = await this.promotionsService.findByProduct(productId);
    if (activePromotions && activePromotions.length > 0) {
      // Usar la promoción con mayor descuento
      let bestPrice = product.price;
      for (const promotion of activePromotions) {
        const promotionPrice = this.promotionsService.calculateFinalPrice(product.price, promotion);
        if (promotionPrice < bestPrice) {
          bestPrice = promotionPrice;
        }
      }
      return bestPrice;
    }

    // Si no hay promociones activas pero hay descuento en el producto
    if (product.discount > 0) {
      return product.price * (1 - product.discount / 100);
    }

    return product.price;
  }
}
