"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GastosTable } from "@/lib/db";
import { CategoriaView } from "./categoria-view";
import { MetodoPagoView } from "./metodo-pago-view";
import TimeAgo from "@/components/time-ago";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import CurrencyView from "@/components/currency-view";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type GastosColumnsProps = {
  onEdit: (gasto: GastosTable) => void;
  onDelete: (id: number) => void;
  onUpdateEstado: (id: number, nuevoEstado: string) => Promise<void>;
};

export const createGastosColumns = ({
  onEdit,
  onDelete,
  onUpdateEstado,
}: GastosColumnsProps): ColumnDef<GastosTable>[] => [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "cantidad",
    header: "Cantidad",
    cell: ({ row }) => <CurrencyView amount={row.original.cantidad} />,
    filterFn: (row, columnId, filterValue) => {
      return (
        row.original.cantidad >= filterValue[0] &&
        row.original.cantidad <= filterValue[1]
      );
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => <TimeAgo date={row.original.fecha} />,
    filterFn: (row, columnId, filterValue) => {
      const fechas: { from: string; to: string } = filterValue;
      const date = new Date(fechas.from);
      const date2 = new Date(fechas.to);
      return (
        new Date(row.original.fecha) >= date &&
        new Date(row.original.fecha) <= date2
      );
    },
  },
  {
    accessorKey: "categoriaId",
    header: "Categoría",
    cell: ({ row }) => <CategoriaView id={row.original.categoriaId} />,
    filterFn: (row, columnId, filterValue) => {
      const options: { value: string; label: string }[] = filterValue;
      return options.some(
        (option) => option.value === row.original.categoriaId.toString()
      );
    },
  },
  {
    accessorKey: "metodoPagoId",
    header: "Método de pago",
    cell: ({ row }) => <MetodoPagoView id={row.original.metodoPagoId} />,
    filterFn: (row, columnId, filterValue) => {
      const options: { value: string; label: string }[] = filterValue;
      return options.some(
        (option) => option.value === row.original.metodoPagoId.toString()
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const gasto = row.original;

      return (
        <Select
          value={gasto.estado}
          onValueChange={(nuevoEstado) => {
            onUpdateEstado(gasto.id, nuevoEstado);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Pendiente
              </div>
            </SelectItem>
            <SelectItem value="pagado">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Pagado
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const options: { value: string; label: string }[] = filterValue;
      return options.some((option) => option.value === row.original.estado);
    },
  },
  {
    id: "actions",
    header: "Acciones",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => {
      const gasto = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(gasto)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(gasto.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
