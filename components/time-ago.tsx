import React from 'react'
import { parse, format, diffMilliseconds } from "@formkit/tempo"

type Props = {
    date: string
    className?: string
}

const TimeAgo = ({ date, className = "" }: Props) => {
  const now = new Date()
  const parsedDate = parse(date)
  const diff = diffMilliseconds(now, parsedDate)
  
  // Calcular el tiempo transcurrido
  const getTimeAgo = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) {
      return seconds <= 1 ? "hace un segundo" : `hace ${seconds} segundos`
    } else if (minutes < 60) {
      return minutes === 1 ? "hace un minuto" : `hace ${minutes} minutos`
    } else if (hours < 24) {
      return hours === 1 ? "hace una hora" : `hace ${hours} horas`
    } else if (days < 7) {
      return days === 1 ? "hace un día" : `hace ${days} días`
    } else if (weeks < 4) {
      return weeks === 1 ? "hace una semana" : `hace ${weeks} semanas`
    } else if (months < 12) {
      return months === 1 ? "hace un mes" : `hace ${months} meses`
    } else {
      return years === 1 ? "hace un año" : `hace ${years} años`
    }
  }

  const timeAgo = getTimeAgo(diff)
  const formattedDate = format(parsedDate, 'DD/MM/YYYY HH:mm')
  
  return (
    <span className={`text-sm text-muted-foreground ${className}`} title={formattedDate}>
      {timeAgo}
    </span>
  )
}

export default TimeAgo