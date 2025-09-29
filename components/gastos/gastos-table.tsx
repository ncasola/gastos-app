"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type GastosTable } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { createGastosColumns } from "./columns";
import { GastosForm } from "./add-form";
import { GastosFilters } from "./gastos-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteConfirm from "../delete-confirm";

export function GastosTable() {
  const [editingGasto, setEditingGasto] = useState<GastosTable | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const gastos = useLiveQuery(() =>
    db.gastos.orderBy("fecha").reverse().toArray()
  );

  const handleEdit = (gasto: GastosTable) => {
    setEditingGasto(gasto);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await db.gastos.delete(deleteId);
        toast.success("Gasto eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el gasto");
        console.error("Error:", error);
      }
    }
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      await db.gastos.update(id, { estado: nuevoEstado });
      toast.success(`Estado actualizado a ${nuevoEstado}`);
    } catch (error) {
      toast.error("Error al actualizar el estado");
      console.error("Error:", error);
    }
  };

  const handleNewGasto = () => {
    setEditingGasto(undefined);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4 sm:px-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gastos</h2>
          <p className="text-muted-foreground">
            Gestiona los gastos disponibles
          </p>
        </div>
        <Button onClick={handleNewGasto} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Gasto
        </Button>
      </div>

      <DataTable
        columns={createGastosColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
          onUpdateEstado: handleUpdateEstado,
        })}
        data={gastos || []}
      >
        {(table) => <GastosFilters table={table} />}
      </DataTable>

      {/* Dialog para formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingGasto ? "Editar Gasto" : "Nuevo Gasto"}
            </DialogTitle>
            <DialogDescription>
              {editingGasto
                ? "Modifica la información del gasto"
                : "Completa la información del gasto que deseas registrar"}
            </DialogDescription>
          </DialogHeader>
          <GastosForm gasto={editingGasto} />
        </DialogContent>
      </Dialog>

      <DeleteConfirm
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        confirmDelete={confirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el gasto."
      />
    </div>
  );
}
