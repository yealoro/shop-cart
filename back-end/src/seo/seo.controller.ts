import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SEO } from './seo.entity';

@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get()
  findAll() {
    return this.seoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seoService.findOne(+id);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.seoService.findByProduct(+productId);
  }

  @Post()
  create(@Body() seo: SEO) {
    return this.seoService.create(seo);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() seo: SEO) {
    return this.seoService.update(+id, seo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seoService.remove(+id);
  }
}