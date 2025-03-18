# shop-cart

NextJs + NestJs Online Shop Web Application

  

## Requisitos Previos

- Node.js (versión 16 o superior)

- npm

- Git

- NestJS CLI (`npm i -g @nestjs/cli`)

  

## Estructura del Proyecto
```bash
shop-cart/

├── frontend/ # Aplicación Next.js

│ ├── app/

│ │ ├── components/ # Componentes reutilizables

│ │ ├── lib/ # Utilidades y configuraciones

│ │ ├── api/ # Rutas de API

│ │ └── (routes)/ # Páginas y rutas

│ ├── public/ # Archivos estáticos

│ ├── styles/ # Estilos globales

│ ├── types/ # Definiciones TypeScript

│ ├── next.config.js

│ └── package.json

│

├── backend/ # Aplicación NestJS

│ ├── src/

│ │ ├── main.ts # Punto de entrada

│ │ ├── app.module.ts # Módulo principal

│ │ ├── modules/ # Módulos de la aplicación

│ │ ├── common/ # Código compartido

│ │ └── config/ # Configuraciones

│ ├── test/ # Tests

│ ├── nest-cli.json

│ └── package.json
```
  

## Configuración Inicial

  

### Frontend (Next.js)

```bash

cd  frontend

npm  install

cp  .env.example  .env.local

npm  run  dev

```

  

### Backend (NestJS)

```bash

cd  backend

npm  install

cp  .env.example  .env

npm  run  start:dev

```

  

## Variables de Entorno

  

### Frontend (.env.local)

```env

NEXT_PUBLIC_API_URL=http://localhost:3000

NEXT_PUBLIC_ASSETS_URL=

```

  

### Backend (.env)

```env

PORT=3000

DATABASE_URL=

JWT_SECRET=

NODE_ENV=development

```

  

## Scripts Disponibles

  

### Frontend

```bash

npm  run  dev  # Desarrollo

npm  run  build  # Construcción

npm  run  start  # Producción

npm  run  lint  # Linting

```

  

### Backend

```bash

npm  run  start  # Iniciar servidor

npm  run  start:dev  # Desarrollo con hot-reload

npm  run  start:debug  # Modo debug

npm  run  start:prod  # Producción

npm  run  test  # Tests unitarios

npm  run  test:e2e  # Tests end-to-end

npm  run  test:cov  # Tests con coverage

```

  

## Comandos Útiles NestJS

```bash

nest  g  resource  nombre-recurso  # Generar CRUD

nest  g  controller  nombre  # Generar controlador

nest  g  service  nombre  # Generar servicio

nest  g  module  nombre  # Generar módulo

```

  

## Tecnologías Principales

  

### Frontend

- Next.js 13+

- React

- TypeScript

- Axios

- CSS Modules/Tailwind CSS

  

### Backend

- NestJS

- TypeScript

- TypeORM/Prisma

- JWT

- Class-validator

- Swagger

  

## Patrones y Buenas Prácticas

  

### Frontend

- Server Components (Next.js 13+)

- Diseño de componentes atómico

- TypeScript strict mode

- Manejo de estado centralizado

  

### Backend

- Arquitectura modular

- DTOs para validación

- Interceptores para respuestas

- Guards para autenticación

- Inyección de dependencias

  

## Control de Versiones

- Ramas feature: `feature/nombre-funcionalidad`

- Ramas bugfix: `bugfix/nombre-error`

- Commits convencionales:

- feat: nuevas características

- fix: correcciones

- docs: documentación

- style: cambios de estilo

- refactor: refactorización

  

## Flujo de Desarrollo

1. Crear nueva rama desde main

2. Desarrollar y probar localmente

3. Commits siguiendo convenciones

4. Pull Request

5. Code Review

6. Merge a main

  

## Enlaces de Documentación

- [Next.js](https://nextjs.org/docs)

- [NestJS](https://docs.nestjs.com/)

- [TypeScript](https://www.typescriptlang.org/docs/)

- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/custom-providers)