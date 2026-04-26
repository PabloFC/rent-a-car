# Rent a Car

Aplicación web para alquiler de coches con frontend en Vite + React, API REST con Express y base de datos PostgreSQL en Supabase.

## Estado del proyecto

- Frontend en producción: https://rent-a-car-mocha.vercel.app/
- Backend en producción: https://rent-a-car-hwhb.onrender.com
- Base de datos y storage: Supabase

## Stack tecnológico

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Multer
- Supabase Storage

## Estructura del repositorio

- frontend: aplicación cliente
- backend: API, lógica de negocio y acceso a datos

## Funcionalidades principales

- Listado de autos por categorías
- Flujo de reserva
- Login y registro de usuarios
- Panel de administración
- CRUD de autos
- Subida de imágenes de autos a Supabase Storage
- Gestión de reservas
- Pago simulado

## Variables de entorno

### Backend

Archivo: backend/.env

Variables mínimas para ejecución en producción:

- DATABASE_URL
- JWT_SECRET
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NODE_ENV=production

Ejemplo base en: backend/.env.example

### Frontend

Archivo: frontend/.env

- VITE_API_URL=https://rent-a-car-hwhb.onrender.com/api

## Ejecución local

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# Completar variables en .env
npx prisma migrate deploy
npm run dev
```

Backend local: http://localhost:3000

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local: http://localhost:5173

## Endpoints de verificación

- Health backend: GET /
- API autos: GET /api/autos

Con backend en producción:

- https://rent-a-car-hwhb.onrender.com/
- https://rent-a-car-hwhb.onrender.com/api/autos

## Deploy

### Backend (Render)

- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /

### Frontend (Vercel)

- Root Directory: frontend
- Build Command: npm run build
- Output Directory: dist
- Variable: VITE_API_URL=https://rent-a-car-hwhb.onrender.com/api

## Notas

- Si se exponen claves en capturas o mensajes, rotarlas en Supabase y actualizar los proveedores de deploy.
- Para el seguimiento operativo del despliegue revisar DEPLOYMENT_CHECKLIST.md.
