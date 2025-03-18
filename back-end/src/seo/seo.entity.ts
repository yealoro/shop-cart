import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class SEO {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.seoData)
  product: Product;

  @Column()
  urlSlug: string;

  @Column()
  metaTitle: string;

  @Column()
  metaDescription: string;

  @Column('text')
  keywords: string;
}
