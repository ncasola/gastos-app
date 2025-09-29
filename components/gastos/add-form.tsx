"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db, GastosTable } from "@/lib/db";
import { toast } from "react-toastify";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import DateTimePicker from "@/components/ui/datetime-picker";

const GastosFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
  descripcion: z
    .string()
    .min(2, { message: "La descripción debe tener al menos 2 caracteres" })
    .max(50, { message: "La descripción no puede tener más de 50 caracteres" }),
  cantidad: z.number().min(0, { message: "La cantidad no puede ser negativa" }),
  fecha: z.string().min(1, { message: "La fecha y hora son obligatorias" }),
  categoriaId: z
    .number()
    .min(0, { message: "Debes seleccionar una categoría válida" }),
  metodoPagoId: z
    .number()
    .min(0, { message: "Debes seleccionar un método de pago válido" }),
  estado: z.string().min(2, { message: "Debes seleccionar un estado válido" }),
});

type GastosFormProps = {
  gasto?: GastosTable;
};

export function GastosForm({ gasto }: GastosFormProps) {
  const isEditing = !!gasto;
  const categorias = useLiveQuery(() => db.categorias.toArray());
  const metodosPago = useLiveQuery(() => db.metodosPago.toArray());
  // 1. Define your form.
  const form = useForm<z.infer<typeof GastosFormSchema>>({
    resolver: zodResolver(GastosFormSchema),
    defaultValues: {
      nombre: gasto?.nombre || "",
      descripcion: gasto?.descripcion || "",
      cantidad: gasto?.cantidad || 0,
      fecha: gasto?.fecha || new Date().toISOString(),
      categoriaId: gasto?.categoriaId || 0,
      metodoPagoId: gasto?.metodoPagoId || 0,
      estado: gasto?.estado || "pendiente",
    },
  });

  // Actualizar valores por defecto cuando los datos estén disponibles (solo para crear)
  useEffect(() => {
    if (!isEditing) {
      if (
        categorias &&
        categorias.length > 0 &&
        form.getValues("categoriaId") === 0
      ) {
        form.setValue("categoriaId", categorias[0].id);
      }
      if (
        metodosPago &&
        metodosPago.length > 0 &&
        form.getValues("metodoPagoId") === 0
      ) {
        form.setValue("metodoPagoId", metodosPago[0].id);
      }
    }
  }, [categorias, metodosPago, form, isEditing]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof GastosFormSchema>) {
    try {
      if (isEditing && gasto) {
        // Editar gasto existente
        await db.gastos.update(gasto.id!, values);
        toast.success("Gasto actualizado");
      } else {
        // Crear nuevo gasto
        const result = await db.gastos.add(values);
        toast.success(`(#${result}) Gasto añadido`);
      }

      // Resetear formulario solo si no es edición
      if (!isEditing) {
        form.reset();
      }
    } catch (error) {
      toast.error("Error al guardar el gasto");
      console.error("Error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Primera fila: Selects - Categoría, Método de pago y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias?.map((categoria) => (
                      <SelectItem
                        key={categoria.id}
                        value={categoria.id.toString()}
                      >
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metodoPagoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de pago</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un método de pago" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {metodosPago?.map((metodoPago) => (
                      <SelectItem
                        key={metodoPago.id}
                        value={metodoPago.id.toString()}
                      >
                        {metodoPago.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="pagado">Pagado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Segunda fila: Nombre y Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Compra supermercado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción del gasto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tercera fila: Cantidad y Fecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y Hora</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : "");
                    }}
                    placeholder="Selecciona fecha y hora"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <span className="mr-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </span>
                {isEditing ? "Actualizando..." : "Guardando..."}
              </>
            ) : isEditing ? (
              "Actualizar gasto"
            ) : (
              "Guardar gasto"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
