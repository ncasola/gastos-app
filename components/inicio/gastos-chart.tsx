"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGastosPorPeriodo } from "@/hooks/use-gastos-stats";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "../ui/badge";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function GastosChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90");

  // Usar el hook optimizado con el valor actual de timeRange
  const chartData = useGastosPorPeriodo(parseInt(timeRange));

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7");
    }
  }, [isMobile]);

  return (
    <>
      {!chartData && <div>Cargando...</div>}
      {chartData && (
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Gastos por categoría</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Total por categoría desde el{" "}
                <Badge className="me-2">
                  {new Date(chartData.diasArray[0].date).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </Badge>
                hasta el
                <Badge className="ms-2">
                  {new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Badge>
              </span>
              <span className="@[540px]/card:hidden">
                Último {timeRange} días
              </span>
            </CardDescription>
            <CardAction>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              >
                <ToggleGroupItem value="90">Últimos 3 meses</ToggleGroupItem>
                <ToggleGroupItem value="30">Últimos 30 días</ToggleGroupItem>
                <ToggleGroupItem value="7">Últimos 7 días</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Últimos 3 meses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90" className="rounded-lg">
                    Últimos 3 meses
                  </SelectItem>
                  <SelectItem value="30" className="rounded-lg">
                    Últimos 30 días
                  </SelectItem>
                  <SelectItem value="7" className="rounded-lg">
                    Últimos 7 días
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData.diasArray}>
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                {chartData.categorias.map((categoria) => (
                  <Area
                    key={categoria.nombre.toLowerCase()}
                    dataKey={categoria.nombre.toLowerCase()}
                    type="natural"
                    fill={categoria.color || "url(#fillMobile)"}
                    stroke={categoria.color || "var(--color-primary)"}
                    stackId="a"
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}
