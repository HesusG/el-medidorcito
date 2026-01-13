# El Medidorcito 💖 (Couples Scorecard)

Una aplicación web moderna para parejas diseñada para fortalecer la relación mediante el seguimiento de metas compartidas, tácticas personalizadas y check-ins semanales. Inspirada en la metodología de "Balanced Scorecard", pero adaptada para el crecimiento personal y de pareja.

![Estilo UI](https://img.shields.io/badge/UI-Neo--Brutalist-pink)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Firebase%20%7C%20Tailwind-blue)

## ✨ Características Principales

- **Dashboard Estilo Scorecard**: Visualiza de un vistazo la salud de tus metas compartidas.
- **Check-ins Semanales**: Sistema de puntuación (1-5) para evaluar el progreso y la percepción de cada uno.
- **Tácticas de Acción**: Define pasos concretos para alcanzar tus metas y evalúa su efectividad con feedback visual (👍/👎).
- **Personalización Total**:
    - Selecciona colores vibrantes para cada meta individual.
    - Cambia el fondo del Dashboard según tu estado de ánimo (6 temas disponibles).
- **Análisis de Brecha (Gap Analysis)**: Gráficos intuitivos para identificar diferencias de percepción entre la pareja.
- **Seguridad y Privacidad**: Espacios privados cifrados por pareja utilizando Firebase Auth y Firestore.
- **Gestión de Espacios**: Posibilidad de abandonar un espacio o eliminarlo por completo.

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+
- Proyecto en Firebase (Authentication con Email/Password + Cloud Firestore)

### 2. Configuración de Entorno
Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 3. Ejecución Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el resultado.

## 🛠️ Flujo de Usuario

1. **Crear Cuenta**: Regístrate con tu correo electrónico.
2. **Configurar Espacio**:
   - Una persona crea un "Nuevo Espacio".
   - Obtendrá un **Código de Pareja** único (visible en el Dashboard).
   - La otra persona se registra y elige "Unirme a un Espacio" usando ese código.
3. **Establecer Metas**: Definan objetivos (Ej: "Tiempo de calidad", "Comunicación", "Finanzas") y asignen tácticas.
4. **Seguimiento**: Realicen check-ins semanales y ajusten según los resultados y gráficos de insights.

## 📱 Tecnologías Utilizadas

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router)
- **Estilo**: [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos & Auth**: [Firebase](https://firebase.google.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)

---
Desarrollado con ❤️ para parejas que buscan crecer juntas.
