import { AlunosDocumentosDto } from "@/dto/alunosDto";
import { DocumentosDto } from "@/dto/documentosDto";
import { api } from "@/lib/axios";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  dadosAluno: AlunosDocumentosDto | null;
  token: string;
}

export function DocumentosAluno({
  dadosAluno,
  isOpen,
  onOpenChange,
  token,
}: Props) {
  const [loadingDocumentos, setLoadingDocumentos] = useState<boolean>(false);
  const [documentos, setDocumentos] = useState<DocumentosDto[]>([]);

  useEffect(() => {
    async function buscarTodosDocumentosAlunos() {
      try {
        setLoadingDocumentos(true);

        const response = await api.get(
          `/alunos/${dadosAluno?.id}/todos/documentos`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDocumentos(response.data);
      } catch (error) {
        toast.error("Ocorreu um erro desconhecido ao buscar documentos");
      } finally {
        setLoadingDocumentos(false);
      }
    }

    if (isOpen) {
      buscarTodosDocumentosAlunos();
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
              Documentos - {dadosAluno?.nome}
            </ModalHeader>
            <ModalBody>
              {loadingDocumentos === true ? (
                <Spinner />
              ) : (
                <div className="space-y-4">
                  {documentos.length > 0 ? (
                    documentos.map((documento) => (
                      <Link
                        target="_blank"
                        href={`/documentos?documentoId=${documento.id}`}
                        className="block"
                      >
                        {documento.nomeArquivo}
                      </Link>
                    ))
                  ) : (
                    <span className="block text-center text-2xl p-4">
                      Não há documentos
                    </span>
                  )}
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
