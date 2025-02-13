"use client";
// icones
import { List, UserPlus, Users } from "@phosphor-icons/react";

// componentes
import { useDisclosure } from "@heroui/react";
import { Button } from "@heroui/button";
import { Menu } from "./Menu";

export function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="w-full p-4 bg-slate-200 shadow-2xl flex justify-between items-center">
      <Button onPress={onOpen}>
        <List size={32} />
      </Button>

      <Menu isOpen={isOpen} onOpenChange={onOpenChange} />
      <h2>nome do usuario</h2>
    </div>
  );
}
