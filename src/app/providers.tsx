"use client";

import { HeroUIProvider } from "@heroui/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export function Provider({ children }: Props) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
