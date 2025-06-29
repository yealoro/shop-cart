import { Repository } from 'typeorm';
import { Product } from './product.entity'; // Asegúrate de que la ruta a tu entidad Product sea correcta
import { AppDataSource } from '../data-source'; // Ajusta esta ruta a tu archivo de configuración de DataSource

// Si estás usando TypeORM 0.3.0 o superior con AppDataSource
export class ProductRepository extends Repository<Product> {
  constructor() {
    // Es crucial pasar el constructor de Product al super,
    // y el EntityManager y Repository de TypeORM
    super(Product, AppDataSource.manager);
  }

  // Puedes añadir métodos personalizados aquí para operaciones específicas de productos
  // Por ejemplo:
  async findProductWithDetails(id: number): Promise<Product | null> {
    return this.findOne({
      where: { id },
      relations: ['images', 'variants', 'category', 'reviews', 'seoData', 'promotions'],
    });
  }

  async createProductWithAllRelations(productData: Partial<Product>): Promise<Product> {
    const newProduct = this.create(productData);
    // Debido a 'cascade: true' en la entidad Product para images y variants,
    // TypeORM se encargará de guardar las relaciones si están en productData
    return this.save(newProduct);
  }

  // Ejemplo de cómo actualizar un producto y sus relaciones
  async updateProductDetails(id: number, productData: Partial<Product>): Promise<Product | null> {
    const product = await this.findProductWithDetails(id);
    if (!product) {
      return null;
    }

    // Fusionar los datos existentes con los nuevos datos
    this.merge(product, productData);
    return this.save(product);
  }
}

// Puedes exportar una instancia directamente si prefieres un enfoque singleton
export const productRepository = new ProductRepository();