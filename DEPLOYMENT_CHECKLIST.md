# Deployment checklist (RentaCar)

Fecha de estado: 2026-04-25

## 1) Supabase (Database + Storage)

- [x] Crear proyecto en Supabase
- [x] Obtener SUPABASE_URL del proyecto
- [x] Obtener API key publishable (anon/public)
- [x] Crear bucket publico `autos` en Storage
- [x] Cambiar `DATABASE_URL` local a Supabase Transaction Pooler (puerto 6543)
- [ ] Ejecutar migraciones Prisma con exito (`npx prisma migrate deploy`)

Notas:

- La `DATABASE_URL` debe usar password URL-encoded (ejemplo: `@` -> `%40`).
- Si falla Transaction Pooler por red/IPv4, probar Session Pooler.

## 2) Backend (Express + Prisma) - estado de codigo

- [x] Migrar upload de disco local a memoria (multer memoryStorage)
- [x] Integrar cliente de Supabase en backend
- [x] Subir imagenes a bucket `autos` de Supabase Storage
- [x] Guardar URL publica en la columna `imagen`
- [x] Intentar borrar imagen anterior al reemplazar/eliminar auto
- [x] Agregar dependencia `@supabase/supabase-js`
- [x] Actualizar `.env.example` con variables de Supabase

Variables requeridas en backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recomendado para backend)
- `NODE_ENV=production`

## 3) Render (deploy backend)

- [x] Crear proyecto en Render
- [x] Conectar repo de GitHub
- [x] Configurar Root Directory: `backend`
- [x] Configurar Build Command: `npm install`
- [x] Configurar Start Command: `npm start`
- [x] Cargar variables de entorno (DATABASE_URL, JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NODE_ENV)
- [x] Deploy inicial exitoso
- [x] Verificar endpoint health (`/`) en URL publica de Render

URL backend activa:

- `https://rent-a-car-hwhb.onrender.com`

## 4) Vercel (deploy frontend)

- [x] Crear proyecto en Vercel
- [x] Conectar repo de GitHub
- [x] Configurar Root Directory: `frontend`
- [x] Build command: `npm run build`
- [x] Output directory: `dist`
- [x] Configurar `VITE_API_URL=https://rent-a-car-hwhb.onrender.com/api`
- [x] Deploy inicial exitoso

URL frontend activa:

- `https://rent-a-car-mocha.vercel.app/`

## 5) Frontend - estado de codigo

- [x] Hacer `baseURL` configurable con `VITE_API_URL` en axios
- [ ] Confirmar que login/listado/autos/reservas funcionan contra backend de Render

## 6) Verificaciones finales

- [ ] Crear usuario
- [ ] Login correcto
- [ ] Crear auto
- [ ] Subir imagen de auto (debe guardarse en Supabase Storage)
- [ ] Crear reserva
- [ ] Ver panel admin
- [ ] Revisar CORS si el frontend no alcanza al backend

## 7) Flujo de actualizaciones automaticas

- [ ] Confirmar que cada `git push` redepliega backend en Render
- [ ] Confirmar que cada `git push` redepliega frontend en Vercel

---

## Comandos utiles

Backend (local):

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

Frontend (local):

```bash
cd frontend
npm install
npm run dev
```
