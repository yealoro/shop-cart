import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column()
  material: string;

  @Column({ default: 0 })
  stock: number;
}
