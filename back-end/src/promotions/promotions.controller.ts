import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { Promotion } from './promotion.entity';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.promotionsService.findActivePromotions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.promotionsService.findByProduct(+productId);
  }

  @Post()
  create(@Body() promotion: Promotion) {
    return this.promotionsService.create(promotion);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() promotion: Promotion) {
    return this.promotionsService.update(+id, promotion);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
}