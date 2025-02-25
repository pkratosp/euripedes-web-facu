import { AlunosDocumentosDto } from "@/dto/alunosDto";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  dadosAluno: AlunosDocumentosDto | null;
}

export function DocumentosAluno({ dadosAluno, isOpen, onOpenChange }: Props) {
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
              {dadosAluno?.documentos?.length !== undefined ? (
                dadosAluno?.documentos?.map((documento) => (
                  <Link href={documento.url} target="_blank">
                    {documento.nomeArquivo}
                  </Link>
                ))
              ) : (
                <span className="block text-center text-2xl p-4">
                  Não a documentos
                </span>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
