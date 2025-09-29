"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

interface UploadFileProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  isLoading?: boolean;
}

export function UploadFile({
  onFileSelect,
  onClear,
  selectedFile,
  isLoading,
}: UploadFileProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          onFileSelect(file);
        } else {
          toast.error("Solo se permiten archivos JSON");
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          onFileSelect(file);
        } else {
          toast.error("Solo se permiten archivos JSON");
        }
      }
    },
    [onFileSelect]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importar Gastos
        </CardTitle>
        <CardDescription>
          Arrastra y suelta un archivo JSON con gastos o haz clic para
          seleccionar uno.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Arrastra tu archivo JSON aquí
              </p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-input")?.click()}
                disabled={isLoading}
                className="mt-4"
              >
                Seleccionar Archivo
              </Button>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileInput}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Formato esperado:</p>
                <p>
                  El archivo debe contener un array de objetos con las
                  propiedades:
                </p>
                <code className="block mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
                  {`{
  "nombre": "string",
  "descripcion": "string", 
  "cantidad": "number",
  "fecha": "YYYY-MM-DD",
  "categoriaId": "number",
  "metodoPagoId": "number",
  "estado": "string"
}`}
                </code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
