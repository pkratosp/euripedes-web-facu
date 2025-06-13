import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { PergutnasType } from "./MatricularAluno";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { DocumentosMatricula } from "./DocumentosMatricula";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  token: string;
  matriculaId: string;
  nomeAluno: string;
}

export function InformacoesAluno({
  isOpen,
  onOpenChange,
  token,
  matriculaId,
  nomeAluno,
}: Props) {
  const [loadingPerguntas, setLoadingPerguntas] = useState<boolean>(false);
  const [perguntas, setPerguntas] = useState<PergutnasType[]>([]);

  const documentoMatricula = useDisclosure();

  useEffect(() => {
    async function hangleBuscarPerguntas() {
      try {
        setLoadingPerguntas(true);

        const response = await api.get("/perguntas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerguntas(response.data.perguntas);
      } catch (error) {
        toast.error("Ocorreu um erro ao carregar as perguntas de matricula");
      } finally {
        setLoadingPerguntas(false);
      }
    }

    if (isOpen) {
      hangleBuscarPerguntas();
    }
  }, [isOpen]);

  return (
    <>
      <DocumentosMatricula
        isOpen={documentoMatricula.isOpen}
        onOpenChange={documentoMatricula.onOpenChange}
        token={token}
        matriculaId={matriculaId}
      />
      <Modal
        isOpen={isOpen}
        scrollBehavior={"inside"}
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Informações da matricula do aluno {nomeAluno}
              </ModalHeader>
              <ModalBody>
                {loadingPerguntas === true ? (
                  <Spinner />
                ) : (
                  <div className="space-y-4">
                    {perguntas.map((pergunta) => (
                      <Input
                        key={pergunta.id}
                        label={pergunta.titulo}
                        description={pergunta.descricao}
                        defaultValue={pergunta.respostas[0]?.resposta ?? ""}
                        required
                        disabled
                      />
                    ))}
                  </div>
                )}
                <div>
                  <Button
                    onPress={() => {
                      documentoMatricula.onOpen();
                    }}
                    className="bg-blue-500 text-white"
                  >
                    Consultar documentos
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
