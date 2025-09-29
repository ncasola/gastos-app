"use client";

import * as React from "react";
import {
  IconHome,
  IconCategory,
  IconCreditCard,
  IconList,
  IconUpload,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Categorías",
      url: "/categorias",
      icon: IconCategory,
    },
    {
      title: "Métodos de Pago",
      url: "/metodos",
      icon: IconCreditCard,
    },
    {
      title: "Gastos",
      url: "/gastos",
      icon: IconList,
    },
    {
      title: "Importar Gastos",
      url: "/importar",
      icon: IconUpload,
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <Image
                  src="/icon0.svg"
                  alt="Gastos App"
                  width={20}
                  height={20}
                />
                <span className="text-base font-semibold">Gastos App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <span className="text-sm text-muted-foreground">
          Desarrollado por ncasolajimenez@gmail.com
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
