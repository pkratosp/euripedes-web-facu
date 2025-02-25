"use client";

// componentes
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { CadastrarAlunos } from "./CadastrarAlunos";
import { ListaDeAlunos } from "./ListaDeAlunos";
import { RegistrarOcorrencia } from "./RegistrarOcorrencia";

interface Props {
  token: string;
}

export function ContainerAluno({ token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const ocorrenciaModal = useDisclosure();

  return (
    <>
      <CadastrarAlunos
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        token={token}
      />

      <RegistrarOcorrencia
        isOpen={ocorrenciaModal.isOpen}
        onOpenChange={ocorrenciaModal.onOpenChange}
        token={token}
      />

      <div className="flex items-center justify-end space-x-4 pb-4">
        <Button onPress={onOpen} className="bg-blue-500 text-white">
          Cadastrar Aluno
        </Button>
        <Button
          onPress={ocorrenciaModal.onOpen}
          className="bg-blue-500 text-white"
        >
          Registrar ocorrencia
        </Button>
        <Input className="w-1/3" placeholder="Pesquisar..." />
      </div>

      <ListaDeAlunos token={token} />
    </>
  );
}
