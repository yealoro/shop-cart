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

  @Column({ default: false })
  featured: boolean; // New field to mark categories for the landing page
  
  @Column({ nullable: true })
  description: string; // Description of the category
  
  @Column({ nullable: true })
  // Asegúrate de que tu entidad Category tenga un campo imageUrl
  @Column({ nullable: true })
  imageUrl: string; // Image for category display

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
