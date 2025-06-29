import "reflect-metadata"; // Importante: debe ir al principio de tu archivo principal o data-source.ts
import { DataSource } from "typeorm";
import { Product } from "./products/product.entity"; // Ajusta la ruta a tus entidades
import { Image } from "./images/image.entity";     // Ajusta la ruta a tus entidades
import { Variant } from "./variants/variant.entity"; // Ajusta la ruta a tus entidades
import { Category } from "./categories/category.entity"; // Si tienes más entidades, agrégalas aquí
import { Review } from "./reviews/review.entity";
import { SEO } from "./seo/seo.entity";
import { Promotion } from "./promotions/promotion.entity";
import * as dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // ¡CUIDADO! Usar `true` solo en desarrollo, borra y recrea la DB
    logging: process.env.NODE_ENV === 'development', // Habilita el log de consultas SQL en desarrollo
    entities: [
        Product,
        Image,
        Variant,
        Category, // Agrega todas tus entidades aquí
        Review,
        SEO,
        Promotion
    ],
    migrations: [], // Aquí irán tus migraciones (para entornos de producción)
    subscribers: [],
});