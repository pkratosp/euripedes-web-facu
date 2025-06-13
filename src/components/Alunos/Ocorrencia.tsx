import { OcorrenciaDto } from "@/dto/ocorrenciaDto";
import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Divider } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  token: string;
  alunoId: string;
  nomeAluno: string;
}

export function Ocorrencia({
  isOpen,
  onOpenChange,
  alunoId,
  nomeAluno,
  token,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDto[]>([]);

  useEffect(() => {
    async function buscarOcorrencia() {
      try {
        setLoading(true);

        const ocorrencias = await api.get(`/ocorrencias/${alunoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOcorrencias(ocorrencias.data);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar ocorrencias deste aluno");
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      buscarOcorrencia();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Ocorrêncis de {nomeAluno}
            </ModalHeader>

            <ModalBody>
              {loading === true ? (
                <Spinner />
              ) : ocorrencias.length > 0 ? (
                ocorrencias.map((ocorrencia) => (
                  <div key={ocorrencia.id} className="space-y-4">
                    <h2>
                      Data da ocorrência{" "}
                      {dayjs(ocorrencia.dataOcorrencia).format("DD/MM/YYYY")}
                    </h2>
                    <span className="text-sm">
                      Usuário que registrou: {ocorrencia.User.nome}
                    </span>
                    <Input
                      label="Titulo"
                      value={ocorrencia?.titulo}
                      isDisabled
                    />
                    <Textarea
                      label="Descrição"
                      value={ocorrencia?.descricao}
                      isDisabled
                    />
                    <Divider className="w-full" />
                  </div>
                ))
              ) : (
                <span className="text-center text-2xl text-black">
                  Não há ocorrências do atendido {nomeAluno}
                </span>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
