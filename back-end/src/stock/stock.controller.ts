import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from './stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.stockService.findByProduct(+productId);
  }

  @Get('variant/:variantId')
  findByVariant(@Param('variantId') variantId: string) {
    return this.stockService.findByVariant(+variantId);
  }

  @Post()
  create(@Body() stock: Stock) {
    return this.stockService.create(stock);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() stock: Stock) {
    return this.stockService.update(+id, stock);
  }

  @Patch(':id/quantity')
  updateQuantity(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.stockService.updateQuantity(+id, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }
}