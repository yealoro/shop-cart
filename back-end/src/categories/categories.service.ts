import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

  async findFeatured(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: {
        featured: true,
      },
      relations: ['products'],
    });
  }

  async findOne(id: number): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  async findByName(name: string): Promise<Category | undefined> { // Return undefined if not found
    const categories = await this.categoriesRepository.findBy({ // Await the promise
      name: ILike(`%${name}%`),
    });
    return categories[0]; // Return the first found category or undefined
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