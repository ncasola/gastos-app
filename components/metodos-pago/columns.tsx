"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type MetodosPagoTable } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MetodosPagoColumnsProps = {
  onEdit: (metodoPago: MetodosPagoTable) => void;
  onDelete: (id: number) => void;
};

export const createMetodosPagoColumns = ({
  onEdit,
  onDelete,
}: MetodosPagoColumnsProps): ColumnDef<MetodosPagoTable>[] => [
  {
    accessorKey: "icono",
    header: "Icono",
    cell: ({ row }) => <div className="text-2xl">{row.getValue("icono")}</div>,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nombre")}</div>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("descripcion")}</div>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    enableSorting: false,
    cell: ({ row }) => {
      const metodoPago = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(metodoPago)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(metodoPago.id)}
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
