"use client";

import { MatriculasDto } from "@/dto/matriculasDto";
import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  token: string;
  aluno: {
    id: string;
    nome: string;
  } | null;
  matricula: Omit<MatriculasDto, "aluno"> | null;
}

const editarMatricula = z.object({
  anoMatricula: z.string(),
});

type RematricularType = z.infer<typeof editarMatricula>;

export function Rematricular({
  isOpen,
  onOpenChange,
  aluno,
  token,
  matricula,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<RematricularType>({});

  async function handleEditarMatricula(data: RematricularType) {
    try {
      setLoading(true);

      await api.patch(
        `/matriculas/${matricula?.id}`,
        {
          anoMatricula: +data.anoMatricula,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Matricula editada com sucesso");
    } catch (error) {
      toast.error("Ocorreu um erro ao editar dados da matricula");
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
              Editar Matricula do aluno {aluno?.nome}
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(handleEditarMatricula)}
                className="space-y-4"
              >
                <Input
                  {...register("anoMatricula")}
                  label="Ano da matricula"
                  required
                />

                <div className="space-x-2 pt-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button isLoading={loading} type="submit" color="primary">
                    Rematricular
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
