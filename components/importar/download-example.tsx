"use client";

import { useState } from "react";
import { faker } from "@faker-js/faker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { CategoriasTable, MetodosPagoTable } from "@/lib/db";
import ResetDatabase from "./reset-database";

interface GastoExample {
  id: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  fecha: string;
  categoriaId: number;
  metodoPagoId: number;
  estado: string;
}

interface ExportData {
  categorias: CategoriasTable[];
  metodosPago: MetodosPagoTable[];
  gastos: GastoExample[];
}

export function DownloadExample() {
  const [isGenerating, setIsGenerating] = useState(false);
  const categorias: CategoriasTable[] = [
    {
      id: 1,
      nombre: "Alimentación",
      descripcion: "Gastos de alimentación",
      color: "red",
      icono: "🍔",
    },
    {
      id: 2,
      nombre: "Transporte",
      descripcion: "Gastos de transporte",
      color: "blue",
      icono: "🚗",
    },
    {
      id: 3,
      nombre: "Hogar",
      descripcion: "Gastos de hogar",
      color: "green",
      icono: "🏠",
    },
    {
      id: 4,
      nombre: "Salud",
      descripcion: "Gastos de salud",
      color: "yellow",
      icono: "🏥",
    },
    {
      id: 5,
      nombre: "Educación",
      descripcion: "Gastos de educación",
      color: "purple",
      icono: "🎓",
    },
  ];
  const metodosPago: MetodosPagoTable[] = [
    {
      id: 1,
      nombre: "Efectivo",
      descripcion: "Gastos en efectivo",
      icono: "💰",
    },
    {
      id: 2,
      nombre: "Tarjeta de crédito",
      descripcion: "Gastos en tarjeta de crédito",
      icono: "💳",
    },
    {
      id: 3,
      nombre: "Transferencia",
      descripcion: "Gastos en transferencia",
      icono: "💸",
    },
    {
      id: 4,
      nombre: "Cheque",
      descripcion: "Gastos en cheque",
      icono: "💰",
    },
  ];

  const generateExampleData = (): GastoExample[] => {
    const gastos: GastoExample[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4); // 4 meses atrás

    // Generar gastos por día para hacer los datos más consistentes
    const currentDate = new Date(startDate);
    let gastoId = 1;

    // Patrones de gastos más realistas por categoría
    const patronesGastos = {
      1: {
        // Alimentación - diario, 1-3 gastos
        frecuencia: 0.9, // 90% de probabilidad
        cantidadGastos: [1, 3],
        rangoPrecio: [5, 50],
      },
      2: {
        // Transporte - frecuente, 0-2 gastos
        frecuencia: 0.7,
        cantidadGastos: [0, 2],
        rangoPrecio: [2, 25],
      },
      3: {
        // Hogar - ocasional, 0-1 gasto
        frecuencia: 0.2,
        cantidadGastos: [0, 1],
        rangoPrecio: [15, 120],
      },
      4: {
        // Salud - muy ocasional, 0-1 gasto
        frecuencia: 0.05,
        cantidadGastos: [0, 1],
        rangoPrecio: [30, 200],
      },
      5: {
        // Educación - muy ocasional, 0-1 gasto
        frecuencia: 0.08,
        cantidadGastos: [0, 1],
        rangoPrecio: [50, 300],
      },
    };

    while (currentDate <= new Date()) {
      const fechaStr = currentDate.toISOString().split("T")[0];

      // Generar gastos para cada categoría según su patrón
      categorias.forEach((categoria) => {
        const patron =
          patronesGastos[categoria.id as keyof typeof patronesGastos];
        if (!patron) return;

        // Decidir si generar gastos para esta categoría este día
        if (Math.random() < patron.frecuencia) {
          const cantidadGastos = faker.helpers.arrayElement(
            Array.from(
              {
                length: patron.cantidadGastos[1] - patron.cantidadGastos[0] + 1,
              },
              (_, i) => patron.cantidadGastos[0] + i
            )
          );

          for (let i = 0; i < cantidadGastos; i++) {
            const metodoPago = faker.helpers.arrayElement(metodosPago || []);

            // Generar nombres más realistas por categoría
            const nombre = generarNombreRealista(
              categoria.id,
              categoria.nombre
            );
            const descripcion = generarDescripcionRealista(
              categoria.id,
              categoria.nombre
            );

            gastos.push({
              id: gastoId++,
              nombre,
              descripcion,
              cantidad: parseFloat(
                faker.commerce.price({
                  min: patron.rangoPrecio[0],
                  max: patron.rangoPrecio[1],
                  dec: 2,
                })
              ),
              fecha: fechaStr,
              categoriaId: categoria.id,
              metodoPagoId: metodoPago.id,
              estado: faker.helpers.arrayElement(["pendiente", "pagado"]),
            });
          }
        }
      });

      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return gastos.sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  };

  const generarNombreRealista = (
    categoriaId: number,
    categoriaNombre: string
  ): string => {
    const nombresPorCategoria = {
      1: [
        // Alimentación
        "Desayuno en casa",
        "Almuerzo en restaurante",
        "Cena familiar",
        "Compra de supermercado",
        "Café de la mañana",
        "Snack de la tarde",
        "Comida rápida",
        "Fruta del mercado",
        "Pan de la panadería",
      ],
      2: [
        // Transporte
        "Taxi al trabajo",
        "Metro urbano",
        "Gasolina del auto",
        "Uber al centro",
        "Bus interurbano",
        "Estacionamiento",
        "Peaje de autopista",
        "Bicicleta compartida",
      ],
      3: [
        // Hogar
        "Luz del mes",
        "Agua del mes",
        "Gas natural",
        "Internet y teléfono",
        "Limpieza del hogar",
        "Reparación electrodoméstico",
        "Decoración",
        "Mantenimiento jardín",
      ],
      4: [
        // Salud
        "Consulta médica",
        "Medicamentos",
        "Exámenes de laboratorio",
        "Farmacia",
        "Dentista",
        "Seguro médico",
        "Vitaminas",
        "Consulta especialista",
      ],
      5: [
        // Educación
        "Curso online",
        "Libros de texto",
        "Material escolar",
        "Clases particulares",
        "Certificación profesional",
        "Seminario",
        "Suscripción educativa",
        "Software educativo",
      ],
    };

    const nombres = nombresPorCategoria[
      categoriaId as keyof typeof nombresPorCategoria
    ] || [`Gasto de ${categoriaNombre}`];
    return faker.helpers.arrayElement(nombres);
  };

  const generarDescripcionRealista = (
    categoriaId: number,
    categoriaNombre: string
  ): string => {
    const descripcionesPorCategoria = {
      1: [
        // Alimentación
        "Comida diaria",
        "Compra semanal de alimentos",
        "Comida fuera de casa",
        "Ingredientes para cocinar",
        "Productos frescos del mercado",
      ],
      2: [
        // Transporte
        "Desplazamiento diario",
        "Viaje de trabajo",
        "Transporte público",
        "Combustible para el vehículo",
        "Movilidad urbana",
      ],
      3: [
        // Hogar
        "Servicios básicos del hogar",
        "Mantenimiento de la casa",
        "Suministros domésticos",
        "Mejoras del hogar",
        "Servicios del hogar",
      ],
      4: [
        // Salud
        "Cuidado de la salud",
        "Tratamiento médico",
        "Prevención y bienestar",
        "Atención médica",
        "Salud personal",
      ],
      5: [
        // Educación
        "Desarrollo profesional",
        "Aprendizaje continuo",
        "Formación académica",
        "Crecimiento personal",
        "Educación y capacitación",
      ],
    };

    const descripciones = descripcionesPorCategoria[
      categoriaId as keyof typeof descripcionesPorCategoria
    ] || [`Descripción de ${categoriaNombre}`];
    return faker.helpers.arrayElement(descripciones);
  };

  const downloadExample = async () => {
    setIsGenerating(true);

    try {
      const gastos = generateExampleData();

      // Crear estructura completa de exportación
      const exportData: ExportData = {
        categorias,
        metodosPago,
        gastos,
      };

      // Crear el archivo JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      // Crear enlace de descarga
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gastos-completo-ejemplo-${
        new Date().toISOString().split("T")[0]
      }.json`;

      // Descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Archivo descargado con ${categorias.length} categorías, ${metodosPago.length} métodos de pago y ${gastos.length} gastos de ejemplo`
      );
    } catch (error) {
      console.error("Error al generar archivo de ejemplo:", error);
      toast.error("Error al generar archivo de ejemplo");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Descargar Datos de Ejemplo
        </CardTitle>
        <CardDescription>
          Descarga un archivo JSON con gastos de ejemplo generados
          aleatoriamente para los últimos 4 meses. Útil para probar la
          funcionalidad de importación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2 items-center justify-center">
          <ResetDatabase />
          <Button onClick={downloadExample} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generando..." : "Descargar Ejemplo"}
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>El archivo incluirá:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Gastos diarios consistentes (4 meses)</li>
            <li>Cantidades realistas por categoría</li>
            <li>{categorias.length} categorías de prueba</li>
            <li>{metodosPago.length} métodos de pago de prueba</li>
            <li>Nombres y descripciones realistas</li>
            <li>Formato compatible con la importación completa</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
