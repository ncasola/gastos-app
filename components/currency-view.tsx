"use client"

import React, { useEffect, useState } from 'react'

type Props = {
    amount: number
}

const CurrencyView = ({ amount }: Props) => {
  const [currency, setCurrency] = useState<string>('EUR')

  useEffect(() => {
    // Obtener la moneda del localStorage, por defecto EUR
    const savedCurrency = localStorage.getItem('currency') || 'EUR'
    setCurrency(savedCurrency)

    // Escuchar eventos de cambio de moneda
    const handleCurrencyChange = (event: CustomEvent) => {
      setCurrency(event.detail.currency)
    }

    // Agregar el listener para el evento personalizado
    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener)

    // Cleanup: remover el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener)
    }
  }, [])

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    
    return formatter.format(amount)
  }

  return (
    <div className="font-medium">
      {formatCurrency(amount, currency)}
    </div>
  )
}

export default CurrencyView