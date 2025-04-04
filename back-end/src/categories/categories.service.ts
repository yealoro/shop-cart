import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['products'],
    });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async create(category: Category): Promise<Category> {
    return this.categoriesRepository.save(category);
  }

  async update(id: number, category: Category): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}