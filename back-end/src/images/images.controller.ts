import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.imagesService.findByProduct(+productId);
  }

  @Post()
  create(@Body() image: Image) {
    return this.imagesService.create(image);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() image: Image) {
    return this.imagesService.update(+id, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}