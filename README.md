# ReportFraud AI — Frontend Administrativo

## Descripción

ReportFraud AI es un proyecto orientado al registro, consulta y gestión de reportes relacionados con posibles fraudes digitales.

Este repositorio contiene el **frontend administrativo** del sistema, desarrollado con Next.js, React y TypeScript. Proporciona una interfaz web para que los administradores puedan iniciar sesión, consultar estadísticas, revisar reportes y gestionar su estado.

El frontend se comunica mediante una API REST desarrollada con NestJS, que administra la información almacenada en una base de datos MySQL.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución.
- **Next.js 16.3.8:** framework para el desarrollo del frontend.
- **React 19:** biblioteca para la construcción de interfaces de usuario.
- **TypeScript:** lenguaje de programación.
- **Axios:** comunicación HTTP con el backend.
- **CSS Modules:** estilos de los componentes.
- **npm:** administración de dependencias.
- **Git y GitHub:** control de versiones y colaboración.

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js 20.9 o superior y npm instalados.
- Git instalado.
- Un editor de código, como Visual Studio Code.
- Para utilizar información real, el backend de ReportFraud AI en ejecución y conectado a MySQL.

Para verificar las herramientas instaladas:

```bash
node -v
npm -v
git --version
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/xfergh/Frontend_Report_Fraud_AI.git
cd Frontend_Report_Fraud_AI
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instala las dependencias del proyecto definidas en `package.json`.

También puede utilizarse `npm ci` para realizar una instalación limpia a partir de `package-lock.json`.

### 3. Configurar la conexión con el backend

El frontend utiliza la variable de entorno `NEXT_PUBLIC_API_URL` para establecer la dirección de la API.

Crear un archivo `.env.local` en la raíz del proyecto, al mismo nivel que `package.json`.

**Backend y frontend en la misma computadora:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Backend en otra computadora:**

```env
NEXT_PUBLIC_API_URL=http://192.168.20.10:3000
```

La dirección `192.168.20.10` corresponde al backend utilizado en la infraestructura física del proyecto. Debe modificarse si el servidor utiliza otra dirección IP.

El archivo `.env.local` no debe subirse al repositorio.

## Creación del proyecto

El proyecto fue desarrollado utilizando Next.js con TypeScript y App Router.

Para crear un proyecto nuevo con la configuración utilizada durante el desarrollo:

```bash
npx create-next-app@16.3.8 agenda-web --ts --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-npm --turbopack --no-react-compiler --yes
```

Posteriormente, se instala Axios:

```bash
cd agenda-web
npm install axios
```

Estos comandos corresponden a la creación inicial de un proyecto. Si se utiliza el repositorio existente de GitHub, únicamente es necesario seguir los pasos de instalación anteriores.

## Ejecución del frontend

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:

http://localhost:3001

Otros comandos disponibles:

**Compilar el proyecto:**

```bash
npm run build
```

**Ejecutar la compilación de producción en el puerto 3001:**

```bash
npm run start -- -p 3001
```

**Ejecutar el analizador de código:**

```bash
npm run lint
```

## Funcionalidades del frontend

### Autenticación

El sistema permite a los administradores iniciar sesión mediante las credenciales registradas en el backend.

Las funcionalidades incluyen:

- Inicio de sesión.
- Obtención de tokens de acceso y actualización.
- Renovación automática del token de acceso.
- Cierre de sesión.
- Acceso al dashboard administrativo.

### Dashboard administrativo

El dashboard proporciona una vista general de los reportes registrados en el sistema.

Permite visualizar:

- Total de reportes.
- Reportes pendientes de revisión.
- Reportes aprobados.
- Reportes rechazados.
- Estadísticas generales de los reportes.

### Gestión de reportes

Los administradores pueden consultar y gestionar los reportes registrados desde la aplicación.

Entre las funcionalidades se encuentran:

- Consultar reportes pendientes.
- Visualizar la información de un reporte.
- Revisar las evidencias asociadas.
- Aprobar reportes.
- Rechazar reportes.
- Mantener reportes en revisión.
- Consultar el historial de reportes revisados.

### Estadísticas

El sistema permite consultar estadísticas relacionadas con los reportes registrados.

Los indicadores incluyen:

- Reportes por estado.
- Reportes por plataforma.
- Reportes por sexo.
- Reportes por rango de edad.

La información se obtiene desde el backend mediante solicitudes HTTP.

### Vista previa

El frontend incluye una vista previa que permite consultar el diseño del dashboard utilizando datos de ejemplo.

Esta funcionalidad facilita la revisión de la interfaz sin necesidad de conectarse al backend.

Los datos de la vista previa son simulados y no modifican la base de datos.

## Rutas principales del frontend

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión de administradores. |
| `/` | Dashboard administrativo. |
| `/preview` | Vista previa del dashboard con datos de ejemplo. |

## Endpoints principales

El frontend consume los endpoints proporcionados por la API REST de ReportFraud AI.

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión y obtener los tokens. |
| POST | `/auth/refresh` | Renovar el token de acceso. |
| POST | `/auth/register-admin` | Registrar un administrador. |

### Reportes

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/reportes/resumen` | Consultar el resumen general. |
| GET | `/reportes/estadisticas` | Consultar estadísticas. |
| GET | `/reportes/pendientes` | Consultar reportes pendientes. |
| GET | `/reportes/historial` | Consultar el historial de reportes. |
| GET | `/reportes/:id` | Consultar los detalles de un reporte. |
| PATCH | `/reportes/:id/estado` | Actualizar el estado de un reporte. |

### Evidencias

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/evidencias/reportes/:id` | Consultar evidencias de un reporte. |
| GET | `/evidencias/archivos/:nombreArchivo` | Descargar un archivo de evidencia. |

Las rutas pertenecen al backend y deben encontrarse disponibles para que las funcionalidades utilicen datos reales.

## Estructura principal del proyecto

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── preview/
│   │   └── page.tsx
│   ├── dashboard.module.css
│   ├── globals.css
│   └── page.tsx
│
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx
│       ├── ReportHistory.tsx
│       ├── ReportStatistics.tsx
│       └── SummaryCards.tsx
│
└── lib/
    └── api.ts

next.config.ts
package.json
package-lock.json
README.md
```

### Descripción de los archivos principales

- **src/app/login/page.tsx:** interfaz de inicio de sesión.
- **src/app/page.tsx:** página principal del dashboard.
- **src/app/preview/page.tsx:** vista previa con datos simulados.
- **src/components/dashboard/:** componentes de la interfaz administrativa.
- **src/lib/api.ts:** configuración de Axios, autenticación y solicitudes a la API.
- **src/app/globals.css:** estilos globales.
- **src/app/dashboard.module.css:** estilos del dashboard.
- **next.config.ts:** configuración general de Next.js.

## Conexión con el backend

La aplicación utiliza Axios para realizar solicitudes a la API de ReportFraud AI.

La configuración se encuentra en:

`src/lib/api.ts`

Durante el desarrollo local se utilizan los siguientes puertos:

| Servicio | Puerto |
|---|---|
| Frontend Next.js | 3001 |
| Backend NestJS | 3000 |
| MySQL | 3306 |

El frontend no se conecta directamente con MySQL. Todas las operaciones de consulta y modificación de información se realizan mediante el backend.

Para utilizar las funcionalidades administrativas, el backend debe estar ejecutándose y conectado correctamente a la base de datos.

## Pruebas de funcionamiento

Para comprobar el funcionamiento del frontend:

1. Iniciar el backend de ReportFraud AI.
2. Verificar la conexión del backend con MySQL.
3. Configurar la variable `NEXT_PUBLIC_API_URL`.
4. Ejecutar `npm run dev`.
5. Abrir `http://localhost:3001/login`.
6. Iniciar sesión con una cuenta de administrador.
7. Consultar el dashboard y sus estadísticas.
8. Revisar reportes pendientes y sus detalles.
9. Comprobar la actualización de estados y la consulta del historial.

Para verificar que el frontend compila correctamente:

```bash
npm run build
```

## Problemas frecuentes

| Problema | Posible solución |
|---|---|
| `npm` no se reconoce | Verificar la instalación de Node.js. |
| `next` no se reconoce | Ejecutar `npm install` para instalar las dependencias. |
| El frontend no inicia | Verificar que el puerto 3001 esté disponible. |
| No se puede conectar con el servidor | Revisar la URL del backend y comprobar que esté ejecutándose. |
| Error de CORS | Verificar la configuración CORS del backend. |
| Error 401 o 403 | Verificar las credenciales y los permisos del administrador. |
| El dashboard no muestra información | Revisar los endpoints del backend y su conexión con MySQL. |

## Estado del proyecto

El frontend administrativo cuenta con las siguientes funcionalidades implementadas:

- Interfaz de inicio de sesión.
- Integración con autenticación JWT.
- Dashboard administrativo.
- Consulta de estadísticas.
- Gestión de reportes pendientes.
- Consulta de detalles y evidencias.
- Actualización del estado de reportes.
- Historial de reportes.
- Vista previa con datos simulados.
- Comunicación con la API REST de ReportFraud AI.

## Documentación adicional

El frontend forma parte del proyecto ReportFraud AI y se integra con el backend desarrollado en NestJS y la base de datos MySQL.

La documentación interactiva de la API, cuando el backend está ejecutándose localmente, se encuentra en:

http://localhost:3000/docs

## Repositorio

**Frontend ReportFraud AI:**

https://github.com/xfergh/Frontend_Report_Fraud_AI

## Referencias

- [Documentación oficial de Next.js](https://nextjs.org/docs)
- [Documentación oficial de React](https://react.dev/)
- [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación oficial de Axios](https://axios-http.com/docs/intro)
- [Documentación oficial de Node.js](https://nodejs.org/)