"use client";

// componentes
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { CadastrarAlunos } from "./CadastrarAlunos";
import { ListaDeAlunos } from "./ListaDeAlunos";

export function ContainerAluno() {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <CadastrarAlunos
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />

      <div className="flex items-center justify-end">
        <Button onPress={onOpen} className="bg-blue-500 text-white">
          Cadastrar Aluno
        </Button>
        <Input className="w-1/3 p-4" placeholder="Pesquisar..." />
      </div>

      <ListaDeAlunos />
    </>
  );
}
