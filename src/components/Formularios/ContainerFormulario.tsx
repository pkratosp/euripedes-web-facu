"use client";

import { useDisclosure } from "@heroui/modal";
import { CadastrarPergunta } from "./CadastrarPergunta";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ListaDePerguntas } from "./ListaDePerguntas";

interface Props {
  token: string;
}

export function ContainerFormulario({ token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <CadastrarPergunta
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        token={token}
      />

      <div className="flex items-center justify-end">
        <Button onPress={onOpen} className="bg-blue-500 text-white">
          Cadastrar pergunta
        </Button>
        <Input className="w-1/3 p-4" placeholder="Pesquisar..." />
      </div>

      <ListaDePerguntas token={token} />
    </>
  );
}
