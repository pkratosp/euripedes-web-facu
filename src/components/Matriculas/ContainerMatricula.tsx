"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { ListaDeMatriculas } from "./ListaDeMatriculas";
import MatricularAluno from "./MatricularAluno";

interface Props {
  token: string;
}

export default function ContainerMatricula({ token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

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
          Cadastrar Aluno
        </Button>
        <Input className="w-1/3 p-4" placeholder="Pesquisar..." />
      </div>

      <ListaDeMatriculas token={token} />
    </>
  );
}
