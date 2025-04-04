import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { Variant } from '../variants/variant.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Variant, { nullable: true })
  @JoinColumn()
  variant: Variant;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}