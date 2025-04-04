import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(+productId);
  }

  @Post()
  create(@Body() review: Review) {
    return this.reviewsService.create(review);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() review: Review) {
    return this.reviewsService.update(+id, review);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}