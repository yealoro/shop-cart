import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Variant } from '../variants/variant.entity';
import { Image } from '../images/image.entity';
import { Review } from '../reviews/review.entity';
import { SEO } from '../seo/seo.entity';
import { Promotion } from '../promotions/promotion.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('categoryId') 
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column()
  sku: string;

  // abc field removed

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number;

  // Nuevos campos para gestión de precios
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  wholesalePrice: number;

  @Column({ default: 5, nullable: true })
  wholesaleMinQuantity: number;

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

  @OneToMany(() => Promotion, (promotion) => promotion.product)
  promotions: Promotion[];

  @Column({ nullable: true, unique: true })
  slug: string;
}
