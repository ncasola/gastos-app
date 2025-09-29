"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { db, MetodosPagoTable } from "@/lib/db"
import { toast } from "react-toastify"

const MetodosPagoFormSchema = z.object({
  nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" }),
  descripcion: z.string()
    .min(2, { message: "La descripción debe tener al menos 2 caracteres" })
    .max(100, { message: "La descripción no puede tener más de 100 caracteres" }),
  icono: z.string()
    .min(1, { message: "El icono es obligatorio" })
    .max(10, { message: "El icono no puede tener más de 10 caracteres" }),
});

type MetodosPagoFormProps = {
  metodoPago?: MetodosPagoTable
}

export function MetodosPagoForm({ metodoPago }: MetodosPagoFormProps) {
  const isEditing = !!metodoPago
  
  const form = useForm<z.infer<typeof MetodosPagoFormSchema>>({
    resolver: zodResolver(MetodosPagoFormSchema),
    defaultValues: {
      nombre: metodoPago?.nombre || "",
      descripcion: metodoPago?.descripcion || "",
      icono: metodoPago?.icono || "",
    },
  })

  async function onSubmit(values: z.infer<typeof MetodosPagoFormSchema>) {
    try {
      if (isEditing && metodoPago) {
        // Editar método de pago existente
        await db.metodosPago.update(metodoPago.id!, values)
        toast.success("Método actualizado")
      } else {
        // Crear nuevo método de pago
        const result = await db.metodosPago.add(values)
        toast.success(`(#${result}) Método añadido`)
      }
      
      // Resetear formulario solo si no es edición
      if (!isEditing) {
        form.reset()
      }
    } catch (error) {
      toast.error("Error al guardar el método de pago")
      console.error("Error:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Primera fila: Nombre e Icono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Tarjeta de débito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="icono" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 💳" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Segunda fila: Descripción */}
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="descripcion" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del método de pago" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <span className="mr-2">
                      <svg className="animate-spin h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    </span>
                    {isEditing ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  isEditing ? "Actualizar método" : "Guardar método"
                )}
              </Button>
            </div>
          </form>
        </Form>
  )
}
