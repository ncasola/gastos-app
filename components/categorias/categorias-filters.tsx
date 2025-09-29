"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { CategoriasTable } from "@/lib/db";

interface CategoriasFiltersProps {
  table: Table<CategoriasTable>;
}

export function CategoriasFilters({ table }: CategoriasFiltersProps) {
  // Obtener valores únicos para los filtros
  const columnFilters = table.getState().columnFilters;

  // Función para obtener filtros activos
  const getActiveFilters = useMemo(() => {
    const activeFilters: string[] = [];

    if (columnFilters.find((f) => f.id === "nombre")?.value) {
      activeFilters.push("Nombre");
    }
    if (columnFilters.find((f) => f.id === "descripcion")?.value) {
      activeFilters.push("Descripción");
    }

    return activeFilters;
  }, [columnFilters]);

  const clearAllFilters = () => {
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-col w-full gap-2 lg:flex-row lg:w-1/3">
      {/* Búsqueda por nombre */}
      <div className="flex items-center gap-2 w-full">
        <Input
          placeholder="Buscar por nombre..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
        />
      </div>

      {/* Búsqueda por descripción */}
      <div className="flex items-center gap-2 w-full">
        <Input
          placeholder="Buscar por descripción..."
          value={
            (table.getColumn("descripcion")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("descripcion")?.setFilterValue(event.target.value)
          }
        />
      </div>

      {/* Botón para limpiar filtros */}
      {getActiveFilters.length > 0 && (
        <Button
          onClick={clearAllFilters}
          size="sm"
          variant="ghost"
          className="w-full sm:w-auto"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar filtros
        </Button>
      )}

      {/* Mostrar filtros activos */}
      {getActiveFilters.length > 0 && (
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <span className="text-sm text-muted-foreground">
            Filtros activos:
          </span>
          <div className="flex flex-wrap gap-1">
            {getActiveFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
