"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { ListaDeMatriculas } from "./ListaDeMatriculas";
import MatricularAluno from "./MatricularAluno";
import { useState } from "react";

interface Props {
  token: string;
}

export default function ContainerMatricula({ token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  const [search, setSearch] = useState<string>("");

  return (
    <>
      <MatricularAluno
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        token={token}
      />

      <div className="flex items-center justify-end">
        <Button onPress={onOpen} className="bg-blue-500 text-white">
          Matricular atendido
        </Button>
        <Input
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="w-1/3 p-4"
          placeholder="Pesquisar..."
        />
      </div>

      <ListaDeMatriculas search={search} token={token} />
    </>
  );
}
