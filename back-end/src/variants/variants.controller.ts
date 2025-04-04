import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { Variant } from './variant.entity';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.variantsService.findByProduct(+productId);
  }

  @Post()
  create(@Body() variant: Variant) {
    return this.variantsService.create(variant);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() variant: Variant) {
    return this.variantsService.update(+id, variant);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantsService.remove(+id);
  }
}