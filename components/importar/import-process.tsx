"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Upload, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { db } from "@/lib/db";

interface ImportGasto {
  nombre: string;
  descripcion: string;
  cantidad: number;
  fecha: string;
  categoriaId: number;
  metodoPagoId: number;
  estado: string;
}

interface ImportCategoria {
  id?: number;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
}

interface ImportMetodoPago {
  id?: number;
  nombre: string;
  descripcion: string;
  icono: string;
}

interface ImportData {
  categorias?: ImportCategoria[];
  metodosPago?: ImportMetodoPago[];
  gastos: ImportGasto[];
}

interface ImportResult {
  total: number;
  success: number;
  errors: number;
  errorDetails: string[];
  categoriasImportadas: number;
  metodosImportados: number;
}

export function ImportProcess({
  selectedFile,
  onImportComplete,
}: {
  selectedFile: File | null;
  onImportComplete: () => void;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const validateGasto = (gasto: unknown): string[] => {
    const errors: string[] = [];

    if (!gasto || typeof gasto !== "object") {
      errors.push("gasto debe ser un objeto");
      return errors;
    }

    const gastoObj = gasto as Record<string, unknown>;

    if (!gastoObj.nombre || typeof gastoObj.nombre !== "string") {
      errors.push("nombre es requerido y debe ser string");
    }

    if (!gastoObj.descripcion || typeof gastoObj.descripcion !== "string") {
      errors.push("descripcion es requerida y debe ser string");
    }

    if (typeof gastoObj.cantidad !== "number" || gastoObj.cantidad <= 0) {
      errors.push("cantidad debe ser un número positivo");
    }

    if (
      !gastoObj.fecha ||
      typeof gastoObj.fecha !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(gastoObj.fecha)
    ) {
      errors.push("fecha debe estar en formato YYYY-MM-DD");
    }

    if (typeof gastoObj.categoriaId !== "number" || gastoObj.categoriaId <= 0) {
      errors.push("categoriaId debe ser un número positivo");
    }

    if (
      typeof gastoObj.metodoPagoId !== "number" ||
      gastoObj.metodoPagoId <= 0
    ) {
      errors.push("metodoPagoId debe ser un número positivo");
    }

    if (!gastoObj.estado || typeof gastoObj.estado !== "string") {
      errors.push("estado es requerido y debe ser string");
    }

    return errors;
  };

  const validateCategoriaAndMetodo = async (
    categoriaId: number,
    metodoPagoId: number
  ): Promise<string[]> => {
    const errors: string[] = [];

    try {
      const categoria = await db.categorias.get(categoriaId);
      if (!categoria) {
        errors.push(`Categoría con ID ${categoriaId} no existe`);
      }

      const metodoPago = await db.metodosPago.get(metodoPagoId);
      if (!metodoPago) {
        errors.push(`Método de pago con ID ${metodoPagoId} no existe`);
      }
    } catch {
      errors.push("Error al validar categoría y método de pago");
    }

    return errors;
  };

  const processImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const fileContent = await selectedFile.text();
      const data: ImportData | ImportGasto[] = JSON.parse(fileContent);

      // Detectar si es el formato nuevo (con categorías y métodos) o el formato antiguo (solo gastos)
      const isNewFormat = data && typeof data === "object" && "gastos" in data;
      const importData: ImportData = isNewFormat
        ? (data as ImportData)
        : { gastos: data as ImportGasto[] };

      const { categorias = [], metodosPago = [], gastos } = importData;

      if (!Array.isArray(gastos)) {
        throw new Error("El archivo debe contener gastos válidos");
      }

      const result: ImportResult = {
        total: gastos.length,
        success: 0,
        errors: 0,
        errorDetails: [],
        categoriasImportadas: 0,
        metodosImportados: 0,
      };

      let totalSteps = gastos.length;
      let currentStep = 0;

      // Mapeo de IDs para categorías y métodos de pago
      const categoriaIdMap: { [oldId: number]: number } = {};
      const metodoPagoIdMap: { [oldId: number]: number } = {};

      // Importar categorías si existen
      if (categorias.length > 0) {
        totalSteps += categorias.length;
        for (const categoria of categorias) {
          try {
            // Verificar si la categoría ya existe por nombre
            const existingCategoria = await db.categorias
              .where("nombre")
              .equals(categoria.nombre)
              .first();

            if (!existingCategoria) {
              const newId = await db.categorias.add({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion,
                color: categoria.color,
                icono: categoria.icono,
              });
              // Mapear el ID original al nuevo ID
              if (categoria.id) {
                categoriaIdMap[categoria.id] = newId as number;
              }
              result.categoriasImportadas++;
            } else {
              // Si ya existe, mapear al ID existente
              if (categoria.id) {
                categoriaIdMap[categoria.id] = existingCategoria.id;
              }
            }
          } catch (error) {
            result.errorDetails.push(
              `Error al importar categoría "${categoria.nombre}": ${error}`
            );
          }
          currentStep++;
          setProgress(Math.round((currentStep / totalSteps) * 100));
        }
      }

      // Importar métodos de pago si existen
      if (metodosPago.length > 0) {
        totalSteps += metodosPago.length;
        for (const metodo of metodosPago) {
          try {
            // Verificar si el método ya existe por nombre
            const existingMetodo = await db.metodosPago
              .where("nombre")
              .equals(metodo.nombre)
              .first();

            if (!existingMetodo) {
              const newId = await db.metodosPago.add({
                nombre: metodo.nombre,
                descripcion: metodo.descripcion,
                icono: metodo.icono,
              });
              // Mapear el ID original al nuevo ID
              if (metodo.id) {
                metodoPagoIdMap[metodo.id] = newId as number;
              }
              result.metodosImportados++;
            } else {
              // Si ya existe, mapear al ID existente
              if (metodo.id) {
                metodoPagoIdMap[metodo.id] = existingMetodo.id;
              }
            }
          } catch (error) {
            result.errorDetails.push(
              `Error al importar método "${metodo.nombre}": ${error}`
            );
          }
          currentStep++;
          setProgress(Math.round((currentStep / totalSteps) * 100));
        }
      }

      // Importar gastos
      for (let i = 0; i < gastos.length; i++) {
        const gasto = gastos[i];

        try {
          // Validar estructura del gasto
          const validationErrors = validateGasto(gasto);
          if (validationErrors.length > 0) {
            result.errors++;
            result.errorDetails.push(
              `Gasto ${i + 1}: ${validationErrors.join(", ")}`
            );
            continue;
          }

          // Mapear los IDs de categoría y método de pago
          let categoriaId = gasto.categoriaId;
          let metodoPagoId = gasto.metodoPagoId;

          // Si tenemos un mapeo para la categoría, usarlo
          if (categoriaIdMap[gasto.categoriaId]) {
            categoriaId = categoriaIdMap[gasto.categoriaId];
          }

          // Si tenemos un mapeo para el método de pago, usarlo
          if (metodoPagoIdMap[gasto.metodoPagoId]) {
            metodoPagoId = metodoPagoIdMap[gasto.metodoPagoId];
          }

          // Validar que la categoría y método de pago existan (usando los IDs mapeados)
          const entityErrors = await validateCategoriaAndMetodo(
            categoriaId,
            metodoPagoId
          );
          if (entityErrors.length > 0) {
            result.errors++;
            result.errorDetails.push(
              `Gasto ${i + 1}: ${entityErrors.join(", ")}`
            );
            continue;
          }

          // Importar gasto con los IDs mapeados
          await db.gastos.add({
            nombre: gasto.nombre,
            descripcion: gasto.descripcion,
            cantidad: gasto.cantidad,
            fecha: gasto.fecha,
            categoriaId: categoriaId,
            metodoPagoId: metodoPagoId,
            estado: gasto.estado,
          });

          result.success++;
        } catch (importError) {
          result.errors++;
          result.errorDetails.push(
            `Gasto ${i + 1}: Error al importar - ${importError}`
          );
        }

        currentStep++;
        setProgress(Math.round((currentStep / totalSteps) * 100));
      }

      setImportResult(result);

      // Mostrar mensajes de éxito
      const successMessages = [];
      if (result.categoriasImportadas > 0) {
        successMessages.push(
          `${result.categoriasImportadas} categorías importadas`
        );
      }
      if (result.metodosImportados > 0) {
        successMessages.push(
          `${result.metodosImportados} métodos de pago importados`
        );
      }
      if (result.success > 0) {
        successMessages.push(`${result.success} gastos importados`);
      }

      if (successMessages.length > 0) {
        toast.success(successMessages.join(", "));
      }

      if (result.errors > 0) {
        toast.error(`${result.errors} gastos no pudieron ser importados`);
      }
    } catch (error) {
      console.error("Error al procesar archivo:", error);
      toast.error(
        "Error al procesar el archivo. Verifica que sea un JSON válido."
      );
    } finally {
      setIsImporting(false);
    }
  };

  if (!selectedFile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Procesar Importación
        </CardTitle>
        <CardDescription>
          Revisa y procesa el archivo seleccionado para importar los gastos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isImporting && !importResult && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Archivo seleccionado: <strong>{selectedFile.name}</strong>
            </p>
            <Button onClick={processImport} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Importar Gastos
            </Button>
          </div>
        )}

        {isImporting && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Procesando gastos...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            <p className="text-sm text-muted-foreground">
              Importando gastos a la base de datos...
            </p>
          </div>
        )}

        {importResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {importResult.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Gastos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-5 w-5" />
                  {importResult.success}
                </div>
                <div className="text-sm text-muted-foreground">
                  Gastos Importados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-5 w-5" />
                  {importResult.categoriasImportadas}
                </div>
                <div className="text-sm text-muted-foreground">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                  <CheckCircle className="h-5 w-5" />
                  {importResult.metodosImportados}
                </div>
                <div className="text-sm text-muted-foreground">Métodos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                  <XCircle className="h-5 w-5" />
                  {importResult.errors}
                </div>
                <div className="text-sm text-muted-foreground">Errores</div>
              </div>
            </div>

            {importResult.errors > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Errores encontrados:
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {importResult.errorDetails.map((error, index) => (
                    <div
                      key={index}
                      className="text-xs text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded"
                    >
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setImportResult(null);
                  onImportComplete();
                }}
                variant="outline"
                className="flex-1"
              >
                Importar Otro Archivo
              </Button>
              <Button
                onClick={() => (window.location.href = "/gastos")}
                className="flex-1"
              >
                Ver Gastos
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
