import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppDataSource } from './data-source'; // Asegúrate de que esta ruta sea correcta

async function bootstrap() {
  dotenv.config(); // Carga las variables de entorno primero

  try {
    // Inicializar la conexión a la base de datos con TypeORM
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida correctamente.");

    const app = await NestFactory.create(AppModule);

    // Configurar CORS
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    const port = process.env.LISTENPORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);

  } catch (error) {
    console.error("Error al iniciar la aplicación o conectar con la base de datos:", error);
    // Es crucial salir si no se puede conectar a la DB
    process.exit(1);
  }
}

bootstrap();