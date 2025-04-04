import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<Review> {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create(review: Review): Promise<Review> {
    return this.reviewsRepository.save(review);
  }

  async update(id: number, review: Review): Promise<Review> {
    await this.reviewsRepository.update(id, review);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reviewsRepository.delete(id);
  }
}