import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SEO } from './seo.entity';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(SEO)
    private seoRepository: Repository<SEO>,
  ) {}

  async findAll(): Promise<SEO[]> {
    return this.seoRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<SEO> {
    return this.seoRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<SEO[]> {
    return this.seoRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create(seo: SEO): Promise<SEO> {
    return this.seoRepository.save(seo);
  }

  async update(id: number, seo: SEO): Promise<SEO> {
    await this.seoRepository.update(id, seo);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.seoRepository.delete(id);
  }
}