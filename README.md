# 💰 Gastos App - Gestión Personal de Gastos

Una aplicación web moderna y responsive para gestionar tus gastos personales, construida con Next.js, TypeScript y Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Dexie.js](https://img.shields.io/badge/Dexie.js-4-FF6B6B?style=for-the-badge&logo=indexeddb)

## ✨ Características Principales

### 🎯 Gestión de Gastos

- **Crear y editar gastos** con información detallada
- **Filtros avanzados** por categoría, método de pago, cantidad y fecha
- **Edición inline del estado** (Pendiente/Pagado) directamente en la tabla
- **Selección de fecha y hora** precisa con DateTimePicker personalizado
- **Rangos de fechas** con selectores de hora para análisis temporal

### 📊 Análisis y Visualización

- **Gráfico de área apilada** mostrando gastos por categoría
- **Períodos flexibles**: últimos 7 días, 30 días o 3 meses
- **Estadísticas en tiempo real** con actualizaciones automáticas
- **Dashboard interactivo** con métricas clave

### 🏷️ Organización

- **Categorías personalizables** con iconos y colores
- **Métodos de pago** configurables con iconos
- **Estados de gasto** (Pendiente/Pagado) para control de flujo
- **Sistema de filtros** múltiples y combinables

### 📱 Experiencia de Usuario

- **Diseño responsive** optimizado para móvil y desktop
- **Interfaz moderna** con componentes Shadcn/ui
- **Navegación intuitiva** con sidebar colapsible
- **Feedback visual** con notificaciones toast

## 🚀 Tecnologías Utilizadas

### Frontend

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS
- **Shadcn/ui** - Componentes de interfaz modernos
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Base de Datos

- **Dexie.js** - Wrapper de IndexedDB para almacenamiento local
- **dexie-react-hooks** - Hooks React para consultas reactivas

### Gráficos y Visualización

- **Recharts** - Librería de gráficos para React
- **date-fns** - Manipulación de fechas

### Iconos y UI

- **Lucide React** - Iconos modernos y consistentes
- **Tabler Icons** - Iconos adicionales para categorías
- **React Day Picker** - Componente de calendario

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd gastos-app
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Ejecutar en modo desarrollo**

```bash
pnpm dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
gastos-app/
├── app/                    # App Router de Next.js
│   ├── categorias/         # Página de gestión de categorías
│   ├── gastos/             # Página de gestión de gastos
│   ├── importar/           # Página de importación/exportación
│   ├── metodos/            # Página de métodos de pago
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio con dashboard
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes base de Shadcn/ui
│   ├── gastos/             # Componentes específicos de gastos
│   ├── categorias/         # Componentes de categorías
│   ├── metodos-pago/       # Componentes de métodos de pago
│   ├── importar/           # Componentes de importación
│   └── inicio/             # Componentes del dashboard
├── hooks/                  # Hooks personalizados
├── lib/                    # Utilidades y configuración
│   ├── db.ts              # Configuración de Dexie
│   └── utils.ts           # Utilidades generales
└── public/                # Archivos estáticos
```

## 🎮 Uso de la Aplicación

### 📝 Crear un Gasto

1. Navega a **Gastos** en el sidebar
2. Haz clic en **"Nuevo Gasto"**
3. Completa el formulario:
   - Selecciona categoría y método de pago
   - Ingresa nombre y descripción
   - Establece cantidad y fecha/hora
   - Elige estado (Pendiente/Pagado)
4. Haz clic en **"Guardar gasto"**

### 🔍 Filtrar Gastos

- **Por cantidad**: Usa el slider de rango
- **Por categoría**: Selecciona múltiples categorías
- **Por método de pago**: Elige métodos específicos
- **Por estado**: Filtra por Pendiente o Pagado
- **Por nombre**: Busca por texto libre
- **Por fecha**: Usa el selector de rango de fechas

### 📊 Ver Estadísticas

1. Ve a la página de **Inicio**
2. Explora el gráfico de gastos por categoría
3. Cambia el período: 7 días, 30 días o 3 meses
4. Observa las tendencias en tiempo real

### 🏷️ Gestionar Categorías y Métodos

- **Categorías**: Crea categorías con iconos y colores personalizados
- **Métodos de pago**: Configura métodos como Efectivo, Tarjeta, etc.
- **Edición**: Modifica cualquier elemento desde la tabla correspondiente

### 📤 Importar/Exportar Datos

1. Ve a **Importar** en el sidebar
2. **Exportar**: Descarga datos de ejemplo o tus datos actuales
3. **Importar**: Sube un archivo JSON con tus gastos
4. **Resetear**: Limpia toda la base de datos si es necesario

## 🔧 Configuración Avanzada

### Personalizar Componentes

Los componentes están basados en Shadcn/ui y pueden personalizarse fácilmente:

```bash
# Añadir nuevos componentes
npx shadcn-ui@latest add <component-name>
```

### Modificar Base de Datos

El esquema de la base de datos se define en `lib/db.ts`:

```typescript
interface GastosTable {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fecha: string; // ISO string format for datetime
  categoriaId: number;
  metodoPagoId: number;
  estado: string;
}
```

### Añadir Nuevas Funcionalidades

1. **Hooks**: Crea hooks personalizados en `hooks/`
2. **Componentes**: Añade componentes en `components/`
3. **Páginas**: Crea nuevas rutas en `app/`

## 🎨 Personalización

### Temas y Colores

La aplicación usa Tailwind CSS con variables CSS personalizadas. Puedes modificar los colores en `app/globals.css`.

### Iconos

- **Lucide React**: Para iconos de interfaz
- **Tabler Icons**: Para iconos de categorías y métodos

### Componentes UI

Todos los componentes siguen el sistema de diseño de Shadcn/ui y pueden personalizarse modificando las clases de Tailwind.

## 📱 Características Responsive

- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Sidebar colapsible**: Se adapta a pantallas pequeñas
- **Tablas responsivas**: Scroll horizontal en móvil
- **Formularios adaptativos**: Layouts que se ajustan al tamaño de pantalla

## 🔒 Privacidad y Datos

- **Almacenamiento local**: Todos los datos se guardan en tu navegador
- **Sin servidor**: No se envían datos a servidores externos
- **Exportación**: Puedes exportar tus datos en cualquier momento
- **Respaldo**: Importa/exporta para hacer respaldos

## 🐛 Resolución de Problemas

### Problemas Comunes

1. **Error de base de datos**

   - Limpia el localStorage del navegador
   - Usa la función "Resetear base de datos" en Importar

2. **Componentes no se ven bien**

   - Verifica que Tailwind CSS esté configurado correctamente
   - Asegúrate de que los componentes de Shadcn/ui estén instalados

3. **Filtros no funcionan**
   - Verifica que hay datos en la base de datos
   - Revisa la consola del navegador para errores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes de interfaz
- [Dexie.js](https://dexie.org/) - Wrapper de IndexedDB
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Iconos

---

**Desarrollado con ❤️ para una mejor gestión de gastos personales**
