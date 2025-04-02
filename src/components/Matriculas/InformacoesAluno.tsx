import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { PergutnasType, RespostaStateType } from "./MatricularAluno";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit } = useForm();
  const [loadingPerguntas, setLoadingPerguntas] = useState<boolean>(false);
  const [perguntas, setPerguntas] = useState<PergutnasType[]>([]);

  // async function handleEditarRepsostas(data: any) {
  //   Object.keys(data).map(async (key) => {});
  // }

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
              {/* <form onSubmit={handleSubmit(handleEditarRepsostas)}> */}
              {loadingPerguntas === true ? (
                <Spinner />
              ) : (
                <div className="space-y-4">
                  {perguntas.map((pergunta) => (
                    <Input
                      // {...register(pergunta.id)}
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

              {/* <div className="space-x-2 pt-4">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" color="primary">
                  Editar Respostas
                </Button>
              </div> */}
              {/* </form> */}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
