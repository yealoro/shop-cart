import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() product: Product) {
    return this.productsService.create(product);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get(':id/price')
  async getPrice(@Param('id') id: string, @Query('quantity') quantity: string) {
    const qty = quantity ? parseInt(quantity) : 1;
    const price = await this.productsService.calculateFinalPrice(+id, qty);
    return { price };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() product: Product) {
    return this.productsService.update(+id, product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
