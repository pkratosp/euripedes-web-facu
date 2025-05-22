"use client";

import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  token: string;
}

const perguntasSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
});

type PerguntasType = z.infer<typeof perguntasSchema>;

export function CadastrarPergunta({
  isOpen,
  onClose,
  onOpenChange,
  token,
}: Props) {
  const { register, handleSubmit } = useForm<PerguntasType>({
    resolver: zodResolver(perguntasSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  async function handleCadastrarPergunta(data: PerguntasType) {
    try {
      setLoading(true);

      await api.post("/formulario/pergunta", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Pergunta cadastrada com sucesso!");
      setTimeout(() => {
        window.document.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Ocorreu um erro ao criar pergunta");
    } finally {
      setLoading(false);
    }
  }

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
              Cadastrar Pergunta
            </ModalHeader>
            <ModalBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleCadastrarPergunta)}
              >
                <Input {...register("titulo")} label="Titulo" />
                <Input {...register("descricao")} label="Descrição" />

                <Button
                  isLoading={loading}
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Fechar
                </Button>
                <Button isLoading={loading} type="submit" color="primary">
                  Cadastrar
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
