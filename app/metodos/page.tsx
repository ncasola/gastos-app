import { SiteHeader } from "@/components/site-header"
import { MetodosPagoTable } from "@/components/metodos-pago/metodos-pago-table"

export default function MetodosPage() {
  return (
    <>
      <SiteHeader title="Métodos de Pago" />
      <MetodosPagoTable />
    </>
  )
}  