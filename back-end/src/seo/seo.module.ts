import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SEO } from './seo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SEO])],
})
export class SeoModule {}
