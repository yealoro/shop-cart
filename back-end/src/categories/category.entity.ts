import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentCategoryId: number; // Para categorías y subcategorías

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
