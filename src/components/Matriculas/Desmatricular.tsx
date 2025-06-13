import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  token: string;
  nomeAluno: string;
  matriculaId: string;
}

export function Desmatricular({
  isOpen,
  onOpenChange,
  nomeAluno,
  token,
  matriculaId,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDesmatricular() {
    try {
      setLoading(true);

      await api.delete(`/matriculas/${matriculaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`Aluno ${nomeAluno} foi desmatriculado com sucesso!`);
      onOpenChange();
    } catch (error) {
      toast.error("Ocorreu um erro ao desmatricular o aluno");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={onOpenChange}
      size="md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Desmatricular aluno
            </ModalHeader>
            <ModalBody>
              <p>
                O aluno <b>{nomeAluno}</b> será desmatriculado
              </p>
            </ModalBody>
            <ModalFooter>
              <div className="space-x-2 pt-4">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={loading}
                  onPress={() => handleDesmatricular()}
                  type="button"
                  color="primary"
                >
                  Remover atendido
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
