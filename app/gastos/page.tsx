import { SiteHeader } from "@/components/site-header"
import { GastosTable } from "@/components/gastos/gastos-table"

export default function GastosPage() {
  return (
    <>
      <SiteHeader title="Gastos" />
      <GastosTable />
    </>
  )
}
