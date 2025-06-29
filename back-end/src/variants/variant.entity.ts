import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ nullable: true }) // Hacemos "size" opcional, ya que no todos los productos tienen talla
  size: string;

  @Column({ nullable: true }) // Hacemos "color" opcional
  color: string;

  @Column({ nullable: true }) // Hacemos "material" opcional
  material: string;

  @Column({ default: 0 })
  stock: number;
}
