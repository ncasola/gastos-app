"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

export function ImportInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Instrucciones de Importación
        </CardTitle>
        <CardDescription>
          Guía paso a paso para importar gastos correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Formato Requerido
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Archivo JSON válido</li>
              <li>• Formato completo o simple de gastos</li>
              <li>• Fechas en formato YYYY-MM-DD</li>
              <li>• Categorías y métodos se importan automáticamente</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Consideraciones
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Categorías duplicadas se omiten automáticamente</li>
              <li>• Métodos duplicados se omiten automáticamente</li>
              <li>• Revisa el formato de fechas</li>
              <li>• Cantidades deben ser positivas</li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Estructura JSON soportada:</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-green-600 mb-1">
                Formato completo (recomendado):
              </h5>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                {`{
  "categorias": [
    {
      "nombre": "Alimentación",
      "descripcion": "Gastos de comida",
      "color": "#ef4444",
      "icono": "🍔"
    }
  ],
  "metodosPago": [
    {
      "nombre": "Efectivo",
      "descripcion": "Pago en efectivo",
      "icono": "💰"
    }
  ],
  "gastos": [
    {
      "nombre": "Comida en restaurante",
      "descripcion": "Almuerzo con amigos",
      "cantidad": 45.50,
      "fecha": "2024-01-15",
      "categoriaId": 1,
      "metodoPagoId": 1,
      "estado": "pagado"
    }
  ]
}`}
              </pre>
            </div>
            <div>
              <h5 className="text-sm font-medium text-blue-600 mb-1">
                Formato simple (solo gastos):
              </h5>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                {`[
  {
    "nombre": "Comida en restaurante",
    "descripcion": "Almuerzo con amigos",
    "cantidad": 45.50,
    "fecha": "2024-01-15",
    "categoriaId": 1,
    "metodoPagoId": 1,
    "estado": "pagado"
  }
]`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
