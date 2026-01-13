# El Medidorcito (Couples Scorecard)

Una aplicación web privada para parejas para realizar un seguimiento de metas compartidas y realizar un check-in semanal ("Balanced Scorecard" para relaciones).

**Estilo UI**: Neo-brutalismo.
**Tech Stack**: Next.js 14, Tailwind CSS, Firebase (Auth + Firestore), Recharts.

## Requisitos Previos

- Node.js 18+
- Una cuenta de Google (para Firebase)

## Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un nuevo proyecto.
2. **Authentication**:
   - Ve a "Authentication" > "Sign-in method".
   - Habilita **Email/Password**.
3. **Firestore Database**:
   - Ve a "Firestore Database".
   - Crea una base de datos (comienza en modo de producción).
   - Ve a la pestaña "Rules" y copia el contenido del archivo `firestore.rules` de este repositorio.
   - Ve a la pestaña "Indexes" (es posible que necesites crear índices para consultas complejas, la consola te avisará si faltan).
4. **Obtener Credenciales**:
   - Ve a "Project Settings" (engranaje).
   - En "Your apps", registra una nueva app web.
   - Copia las variables de configuración (`apiKey`, `authDomain`, etc.).

## Instalación Local

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz (puedes copiar `.env.example` y renombrarlo).
   - Rellena las variables con tus credenciales de Firebase.
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   ...
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000).

## Uso del Aplicativo (flujo)

1. **Registro**: Crea una cuenta en `/signup`.
2. **Setup**:
   - La primera persona elige "Crear Nuevo" y obtiene un ID de pareja (se encuentra en su perfil de Firestore o URL si lo implementaste, para este MVP el código es interno, pero al crear se une automáticamente. Para invitar a la otra persona, ve a Firestore > `users` > tu usuario > copia el campo `coupleId` y envíaselo a tu pareja).
   *Nota: En una versión futura se mostrará el código en el Dashboard.*
3. **Unirse**: La segunda persona se registra y elige "Unirme", pegando el `coupleId`.
4. **Metas**: Creen metas en `/goals/new`.
5. **Check-in**: Cada semana, califiquen las metas.
6. **Dashboard**: Vean sus puntajes y brechas.

## Despliegue (Firebase App Hosting)

Esta app está lista para **Firebase App Hosting** (la nueva generación de hosting de Firebase para Next.js).

1. Sube tu código a GitHub.
2. En Firebase Console, ve a **App Hosting**.
3. "Get started" y conecta tu cuenta de GitHub.
4. Selecciona el repositorio `el-medidorcito`.
5. Configura las variables de entorno (las mismas del `.env`) en la configuración del backend de App Hosting.
6. Despliega.

## Estructura del Proyecto

- `/app`: Rutas del App Router (Login, Dashboard, Goals, etc.)
- `/components`:
  - `/ui`: Componentes base Neo-brutalistas (Button, Card, Input).
  - `/goals`: Componentes de negocio (GoalCard, CheckinForm).
  - `/charts`: Gráficos Recharts.
- `/lib`: Utilidades y constantes.
- `/services`: Configuración de Firebase y Auth.

## Licencia

MIT.
