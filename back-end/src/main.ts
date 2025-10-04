import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { json, urlencoded } from 'express'; // Asegúrate de que esta ruta sea correcta
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  dotenv.config(); // Carga las variables de entorno primero

  try {
    // Inicializar la conexión a la base de datos con TypeORM
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida correctamente.");

    const app = await NestFactory.create(AppModule);

    // Configurar CORS
    app.use(json({ limit: '25mb' }));
    app.use(urlencoded({ limit: '25mb', extended: true }));

    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3300'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Servir estáticamente la carpeta /uploads
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    app.use('/uploads', express.static(uploadsDir));

    const port = process.env.PORT || 3300;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);

  } catch (error) {
    console.error("Error al iniciar la aplicación o conectar con la base de datos:", error);
    // Es crucial salir si no se puede conectar a la DB
    process.exit(1);
  }
}

bootstrap();