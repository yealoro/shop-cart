import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Variant } from '../variants/variant.entity';
import { Image } from '../images/image.entity';
import { Review } from '../reviews/review.entity';
import { SEO } from '../seo/seo.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column()
  sku: string;

  @Column()
  abc: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 1 })
  stock: number;

  @Column()
  brand: string;

  @Column()
  manufacturer: string;

  @Column()
  supplier: string;

  @OneToMany(() => SEO, (seo) => seo.product)
  seoData: SEO[];
}
