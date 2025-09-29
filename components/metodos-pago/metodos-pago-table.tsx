"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type MetodosPagoTable } from "@/lib/db";
import { DataTable } from "@/components/data-table";
import { createMetodosPagoColumns } from "./columns";
import { MetodosPagoForm } from "./add-form";
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

export function MetodosPagoTable() {
  const [editingMetodoPago, setEditingMetodoPago] = useState<
    MetodosPagoTable | undefined
  >();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const metodosPago = useLiveQuery(() =>
    db.metodosPago.orderBy("nombre").toArray()
  );

  const handleEdit = (metodoPago: MetodosPagoTable) => {
    setEditingMetodoPago(metodoPago);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await db.metodosPago.delete(deleteId);
        toast.success("Método de pago eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el método de pago");
        console.error("Error:", error);
      }
    }
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleNewMetodoPago = () => {
    setEditingMetodoPago(undefined);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-4 sm:px-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Métodos de Pago</h2>
          <p className="text-muted-foreground">
            Gestiona los métodos de pago disponibles
          </p>
        </div>
        <Button onClick={handleNewMetodoPago} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Método
        </Button>
      </div>

      <DataTable
        columns={createMetodosPagoColumns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
        data={metodosPago || []}
      />

      {/* Dialog para formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMetodoPago
                ? "Editar Método de Pago"
                : "Nuevo Método de Pago"}
            </DialogTitle>
            <DialogDescription>
              {editingMetodoPago
                ? "Modifica la información del método de pago"
                : "Completa la información del método de pago que deseas registrar"}
            </DialogDescription>
          </DialogHeader>
          <MetodosPagoForm metodoPago={editingMetodoPago} />
        </DialogContent>
      </Dialog>

      <DeleteConfirm
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        confirmDelete={confirmDelete}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Se eliminará permanentemente el método de pago."
      />
    </div>
  );
}
