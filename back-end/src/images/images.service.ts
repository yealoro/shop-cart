import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imagesRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<Image> {
    return this.imagesRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<Image[]> {
    return this.imagesRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create(image: Image): Promise<Image> {
    return this.imagesRepository.save(image);
  }

  async update(id: number, image: Image): Promise<Image> {
    await this.imagesRepository.update(id, image);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.imagesRepository.delete(id);
  }
}