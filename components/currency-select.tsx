"use client"

import React, { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const MONEDAS = [
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "Dólar ($)" },
]

type Props = {
  className?: string
}

const CurrencySelect = ({ className }: Props) => {
  const [currency, setCurrency] = useState<string>("EUR")

  useEffect(() => {
    const saved = localStorage.getItem("currency") || "EUR"
    setCurrency(saved)
  }, [])

  const handleChange = (value: string) => {
    setCurrency(value)
    localStorage.setItem("currency", value)
    
    // Emitir evento personalizado para notificar el cambio de moneda
    const currencyChangeEvent = new CustomEvent('currencyChanged', {
      detail: { currency: value }
    })
    window.dispatchEvent(currencyChangeEvent)
  }

  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Label htmlFor="currency-select" className="text-sm font-medium">
        Moneda
      </Label>
      <Select
        onValueChange={handleChange}
        value={currency || "EUR"}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Euro (€)" />
        </SelectTrigger>
        <SelectContent>
          {MONEDAS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default CurrencySelect