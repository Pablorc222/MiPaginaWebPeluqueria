# Urban Barber — Web + Panel de administración

App de barbería (React + Vite + Supabase): reserva de citas pública y panel
de administración en la misma aplicación.

## Cómo arrancar

```bash
npm install
npm run dev
```

Necesitas un archivo `.env.local` con:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Rutas

| Ruta                 | Página            |
|----------------------|--------------------|
| `/`                  | Web pública        |
| `/reservar`          | Reservar cita      |
| `/admin`             | Dashboard          |
| `/admin/calendario`  | Calendario y citas |
| `/admin/clientes`    | Clientes           |
| `/admin/servicios`   | Servicios          |
| `/admin/horarios`    | Días/horas bloqueados (nuevo, requiere crear tablas — ver abajo) |
| `/admin/config`      | Configuración del negocio (nuevo, requiere crear tabla — ver abajo) |

## Estructura del proyecto

```
src/
├── pages/          Pantallas completas (una por ruta)
├── components/
│   ├── layout/     Header, Sidebar, MobileNav, AdminLayout
│   ├── calendar/   Calendar, CalendarDay, CalendarWeek, AppointmentCard
│   ├── appointments/  AppointmentForm, AppointmentModal, AppointmentDetails
│   ├── clients/    ClientList, ClientForm, ClientDetails
│   ├── services/   ServiceList, ServiceForm
│   └── common/     Button, Modal, Input, Select, Loading, ConfirmDialog
├── services/       Toda la comunicación con Supabase (una función = una consulta)
├── hooks/          useAppointments, useClients, useServices, useAvailability
├── utils/          dates.js, availability.js, validation.js
└── lib/
    ├── supabase.js Cliente único de Supabase
    └── router.jsx  Router propio sin dependencias (ver nota abajo)
```

## Nota sobre el router

Este entorno no tenía `react-router-dom` instalado y no había forma de
añadirlo (sin acceso a internet en el momento de construir esto). Se ha
implementado un router mínimo en `src/lib/router.jsx` que usa la History
API del navegador y cubre exactamente lo mismo que necesita este proyecto
(rutas planas, `navigate()`, atrás/adelante del navegador).

Si más adelante quieres usar `react-router-dom`:

```bash
npm install react-router-dom
```

Solo tendrías que tocar `src/App.jsx` (donde están las rutas) y
`src/lib/router.jsx` — el resto de páginas y componentes usan `useRouter()`
y no necesitan cambios.

## Tablas de Supabase que faltan por crear

El proyecto ya usa 3 tablas: `appointments`, `clients`, `services`.

Las páginas **Horarios** (`/admin/horarios`) y **Configuración**
(`/admin/config`) son funcionalidad nueva pensada para 3 tablas que aún no
existen. Si no las creas, esas dos páginas siguen funcionando pero avisan
de que faltan, sin romper el resto de la app:

- `blocked_days` — columnas: `id`, `date`, `reason`, `created_at`
- `blocked_times` — columnas: `id`, `date`, `time`, `reason`, `created_at`
- `business_settings` — una única fila (`id = 1`) con `business_name`,
  `opening_time`, `closing_time`, `closed_weekday`

Las funciones ya están listas en `src/services/blockedDays.js`,
`blockedTimes.js` y `settings.js` — en cuanto crees las tablas con esas
columnas, todo funciona sin tocar código.
