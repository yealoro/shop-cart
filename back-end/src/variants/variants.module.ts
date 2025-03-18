import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
})
export class VariantsModule {}
