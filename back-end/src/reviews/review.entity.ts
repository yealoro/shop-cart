import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @Column()
  rating: number;

  @Column('text')
  comment: string;

  @Column()
  userId: number; // Usuario que dejó la reseña
}
