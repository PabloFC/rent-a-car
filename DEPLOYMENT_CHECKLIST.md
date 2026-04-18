# Deployment checklist (RentaCar)

Fecha de estado: 2026-04-18

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

## 3) Railway (deploy backend)

- [ ] Crear proyecto en Railway
- [ ] Conectar repo de GitHub
- [ ] Configurar Root Directory: `backend`
- [ ] Configurar Start Command: `node src/index.js`
- [ ] Cargar variables de entorno (DATABASE_URL, JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NODE_ENV)
- [ ] Deploy inicial exitoso
- [ ] Verificar endpoint health (`/` o `/api/...`) en URL publica de Railway

## 4) Vercel (deploy frontend)

- [ ] Crear proyecto en Vercel
- [ ] Conectar repo de GitHub
- [ ] Configurar Root Directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Configurar `VITE_API_URL=https://<tu-backend-railway>/api`
- [ ] Deploy inicial exitoso

## 5) Frontend - estado de codigo

- [x] Hacer `baseURL` configurable con `VITE_API_URL` en axios
- [ ] Confirmar que login/listado/autos/reservas funcionan contra backend de Railway

## 6) Verificaciones finales

- [ ] Crear usuario
- [ ] Login correcto
- [ ] Crear auto
- [ ] Subir imagen de auto (debe guardarse en Supabase Storage)
- [ ] Crear reserva
- [ ] Ver panel admin
- [ ] Revisar CORS si el frontend no alcanza al backend

## 7) Flujo de actualizaciones automaticas

- [ ] Confirmar que cada `git push` redepliega backend en Railway
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
