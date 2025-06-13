"use client";

// componentes
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { CadastrarAlunos } from "./CadastrarAlunos";
import { ListaDeAlunos } from "./ListaDeAlunos";
import { RegistrarOcorrencia } from "./RegistrarOcorrencia";
import { useState } from "react";

interface Props {
  token: string;
}

export function ContainerAluno({ token }: Props) {
  const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();
  const ocorrenciaModal = useDisclosure();

  const [search, setSearch] = useState<string>("");

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
          Cadastrar atendido
        </Button>
        <Button
          onPress={ocorrenciaModal.onOpen}
          className="bg-blue-500 text-white"
        >
          Registrar Ocorrência
        </Button>
        <Input
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="w-1/3"
          placeholder="Pesquisar..."
        />
      </div>

      <ListaDeAlunos search={search} token={token} />
    </>
  );
}
