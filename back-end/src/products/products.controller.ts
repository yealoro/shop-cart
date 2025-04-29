import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CategoriesService } from '../categories/categories.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService
  ) {}

  @Post()
  create(@Body() product: Product) {
    return this.productsService.create(product);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Rutas específicas PRIMERO
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    try {
      const product = await this.productsService.findBySlug(slug);
      if (!product) {
        throw new NotFoundException(`Product with slug "${slug}" not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error fetching product by slug: ${error.message}`);
    }
  }

  @Get('category/:categoryName')
  async getProductsByCategory(@Param('categoryName') categoryName: string) {
    try {
      // First check if categoryName is a numeric ID
      if (/^\d+$/.test(categoryName)) {
        // If it's a number, use it directly as category ID
        const categoryId = parseInt(categoryName, 10);
        const products = await this.productsService.findByCategory(categoryId);
        return products || [];
      } else {
        // If it's not a number, try to find the category by slug/name
        const category = await this.categoriesService.findByName(categoryName);
        if (!category) {
          throw new NotFoundException(`Category "${categoryName}" not found`);
        }
        // Then get products for that category using the ID
        const products = await this.productsService.findByCategory(category.id);
        return products || [];
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  @Get(':id/price')
// Remove this implementation since it's duplicated below

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() product: Product) {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // Rutas dinámicas DESPUÉS
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/price')
  async getPrice(@Param('id', ParseIntPipe) id: number, @Query('quantity') quantity: string) {
    const qty = quantity ? parseInt(quantity) : 1;
    // Add validation for qty as well if needed
    if (isNaN(qty) || qty <= 0) { 
      // Handle invalid quantity, e.g., throw BadRequestException or default to 1
      // For now, let's assume default behavior or rely on service validation
    }
    const price = await this.productsService.calculateFinalPrice(id, qty);
    return { price };
  }
}
