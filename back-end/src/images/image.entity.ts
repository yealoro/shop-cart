import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string; // Aquí se almacenará la ruta o URL de la imagen

  @Column({ nullable: true })
  altText: string; // Texto alternativo para accesibilidad y SEO

  @Column({ default: 0 })
  order: number; // Para definir el orden de las imágenes de un producto (e.g., imagen principal, segunda, etc.)

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;
}