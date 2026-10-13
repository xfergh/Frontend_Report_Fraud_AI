ReportFraudAI - Frontend Web

Frontend web administrativo de ReportFraudAI, una plataforma para la gestión y revisión de reportes relacionados con posibles fraudes digitales realizados mediante herramientas de inteligencia artificial.

La aplicación está desarrollada con Next.js y está diseñada para conectarse a un backend NestJS mediante una API HTTP.

Tecnologías utilizadas

Tecnología

Uso

Next.js 16.3.8

Framework principal del frontend

React

Desarrollo de componentes e interfaces

TypeScript

Tipado y organización del código

Axios

Comunicación HTTP con el backend

CSS

Estilos y diseño responsivo

npm

Administración de dependencias

Requisitos previos

Node.js 20 o superior

npm

Git

Instalación

Clonar el repositorio.

git clone https://github.com/xfergh/Frontend_Report_Fraud_AI.git

Entrar a la carpeta del proyecto.

cd Frontend_Report_Fraud_AI

Instalar las dependencias.

npm ci

Iniciar el servidor de desarrollo.

npm run dev

Abrir la aplicación en el navegador.

http://localhost:3001

Configuración del backend

El frontend utiliza Axios para comunicarse con el backend.

La dirección predeterminada de la API es http://localhost:3000.

Esta dirección puede configurarse mediante la variable de entorno NEXT_PUBLIC_API_URL.

La autenticación requiere que el backend implemente los endpoints correspondientes de inicio de sesión y renovación de tokens.

Estructura inicial

Ruta

Descripción

src/app/login/page.tsx

Formulario de inicio de sesión

src/app/page.tsx

Redirección inicial hacia el login

src/app/layout.tsx

Estructura general y metadatos

src/app/globals.css

Estilos globales e identidad visual

src/lib/api.ts

Cliente Axios y funciones de autenticación

Funcionalidades implementadas

Interfaz de inicio de sesión.

Validación de correo electrónico y contraseña.

Almacenamiento local de access token y refresh token.

Envío automático del access token mediante Axios.

Manejo de errores de autenticación y conexión.

Renovación automática del access token ante respuestas HTTP 401.

Diseño adaptable a diferentes tamaños de pantalla.

Estado del desarrollo

La estructura inicial y la interfaz de autenticación están implementadas.

La conexión con el backend NestJS sigue pendiente de integración y pruebas. Por este motivo, el inicio de sesión real todavía requiere los servicios correspondientes.

El dashboard administrativo, la gestión de reportes, las estadísticas y el historial se incorporarán progresivamente en las siguientes etapas del proyecto.

Proyecto

ReportFraudAI

Tecnológico de Monterrey

Equipo 5

TC2007B - Integración de seguridad informática en redes y sistemas de software