import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async findAll(): Promise<Image[]> {
    return this.imagesRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: number): Promise<Image> {
    return this.imagesRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<Image[]> {
    return this.imagesRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create(image: any): Promise<Image> {
    // Mapeo de productId -> relación product
    const payload = { ...image };
    if (payload.productId && !payload.product) {
      payload.product = { id: payload.productId } as any;
    }

    // Si llega una data URL, guardamos físicamente en /uploads/products y actualizamos url
    if (typeof payload.url === 'string' && payload.url.startsWith('data:')) {
      const match = payload.url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const mime = match ? match[1] : 'image/png';
      const base64Data = match ? match[2] : payload.url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mime.split('/')[1] || 'png';

      const safeFilename =
        (payload.filename ||
          `product_${payload.product?.id ?? 'unknown'}_${Date.now()}.${ext}`)
          .replace(/[^a-zA-Z0-9._-]/g, '_');

      const fs = await import('fs');
      const path = await import('path');
      // back-end/uploads/products
      const targetDir = path.resolve(__dirname, '..', '..', 'uploads', 'products');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      // URL pública relativa
      payload.url = `/uploads/products/${safeFilename}`;
    }

    const entity = this.imagesRepository.create({
      url: payload.url,
      altText: payload.altText,
      order: payload.order ?? 0,
      product: payload.product,
    });
    return this.imagesRepository.save(entity);
  }

  async update(id: number, image: any): Promise<Image> {
    const payload = { ...image };

    // Mapeo de productId -> relación product
    if (payload.productId && !payload.product) {
      payload.product = { id: payload.productId } as any;
    }

    // Si llega url como data URL al actualizar, también guardamos como archivo
    if (typeof payload.url === 'string' && payload.url.startsWith('data:')) {
      const match = payload.url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      const mime = match ? match[1] : 'image/png';
      const base64Data = match ? match[2] : payload.url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mime.split('/')[1] || 'png';

      const safeFilename =
        (payload.filename ||
          `image_${id}_${Date.now()}.${ext}`)
          .replace(/[^a-zA-Z0-9._-]/g, '_');

      const fs = await import('fs');
      const path = await import('path');
      const targetDir = path.resolve(__dirname, '..', '..', 'uploads', 'products');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      payload.url = `/uploads/products/${safeFilename}`;
    }

    await this.imagesRepository.update(id, {
      url: payload.url,
      altText: payload.altText,
      order: payload.order ?? 0,
      product: payload.product,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.imagesRepository.delete(id);
  }
}