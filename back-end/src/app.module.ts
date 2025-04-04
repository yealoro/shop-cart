import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { VariantsModule } from './variants/variants.module';
import { StockModule } from './stock/stock.module';
import { ImagesModule } from './images/images.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SeoModule } from './seo/seo.module';
import { PromotionsModule } from './promotions/promotions.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Solo en desarrollo, no en producción
    }),
    ProductsModule,
    CategoriesModule,
    VariantsModule,
    StockModule,
    ImagesModule,
    ReviewsModule,
    SeoModule,
    PromotionsModule,
  ],
})
export class AppModule {}
