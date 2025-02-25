"use client";

import { AlunosDto } from "@/dto/alunosDto";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/modal";
import { DateInput, Spinner } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { CalendarDate, parseDate } from "@internationalized/date";
import { toast } from "sonner";
import { api } from "@/lib/axios";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  dadosAluno: AlunosDto | null;
  token: string;
}

const sexo = [
  {
    key: "masculino",
    label: "masculino",
  },
  {
    key: "feminino",
    label: "feminino",
  },
];

const alunoSchema = z.object({
  filiacaoMae: z.string(),
  responsavel: z.string(),
  rgResponsavel: z.string(),
  cpfResponsavel: z.string(),
  naturalidade: z.string(),
  estado: z.string(),
  ultimaProcedencia: z.string(),
  ra: z.string(),
  escola: z.string(),
  serieEscola: z.string(),
  endereco: z.string(),
  bairro: z.string(),
  cep: z.string(),
  contatos: z.string(),
});

type AlunoType = z.infer<typeof alunoSchema>;

export function EditarAluno({
  isOpen,
  onClose,
  onOpenChange,
  dadosAluno,
  token,
}: Props) {
  const { register, handleSubmit, control } = useForm<AlunoType>({
    defaultValues: {
      bairro: dadosAluno?.bairro,
      cep: dadosAluno?.cep,
      contatos: dadosAluno?.contatos,
      cpfResponsavel: dadosAluno?.cpfResponsavel,
      endereco: dadosAluno?.endereco,
      escola: dadosAluno?.escola,
      estado: dadosAluno?.estado,
      filiacaoMae: dadosAluno?.filiacaoMae,
      naturalidade: dadosAluno?.naturalidade,
      ra: dadosAluno?.ra,
      responsavel: dadosAluno?.responsavel,
      rgResponsavel: dadosAluno?.rgResponsavel,
      serieEscola: dadosAluno?.serieEscola,
      ultimaProcedencia: dadosAluno?.ultimaProcedencia,
    },
  });

  const [files, setFiles] = useState<FileList | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAnexos, setLoadingAnexos] = useState<boolean>(false);

  async function handleEditarAluno(data: AlunoType) {
    try {
      setLoading(true);

      await api.put(`aluno/${dadosAluno?.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Aluno edita com sucesso");
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao atualizar dados do aluno");
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Editar aluno - {dadosAluno?.nome}
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(handleEditarAluno)}
                className="space-y-4"
              >
                <Input
                  {...register("ra", { value: dadosAluno?.ra })}
                  label="ra"
                  required
                />
                <Input
                  {...register("estado", { value: dadosAluno?.estado })}
                  label="estado"
                  required
                />
                <Input
                  {...register("endereco", { value: dadosAluno?.endereco })}
                  label="endereço"
                  required
                />
                <Input
                  {...register("bairro", { value: dadosAluno?.bairro })}
                  label="bairro"
                  required
                />
                <Input
                  {...register("cep", { value: dadosAluno?.cep })}
                  label="cep"
                  required
                />
                <Input
                  {...register("escola", { value: dadosAluno?.escola })}
                  label="escola"
                  required
                />
                <Input
                  {...register("serieEscola", {
                    value: dadosAluno?.serieEscola,
                  })}
                  label="série da escola"
                  required
                />
                <Input
                  {...register("ultimaProcedencia", {
                    value: dadosAluno?.ultimaProcedencia,
                  })}
                  label="Ultima procedencia"
                  required
                />
                <Input
                  {...register("responsavel", {
                    value: dadosAluno?.responsavel,
                  })}
                  label="Nome do responsavel"
                  required
                />
                <Input
                  {...register("rgResponsavel", {
                    value: dadosAluno?.rgResponsavel,
                  })}
                  label="Rg do responsavel"
                  required
                />
                <Input
                  {...register("cpfResponsavel", {
                    value: dadosAluno?.cpfResponsavel,
                  })}
                  label="CPF do responsavel"
                  required
                />
                <Input
                  {...register("filiacaoMae", {
                    value: dadosAluno?.filiacaoMae,
                  })}
                  label="Filiação mãe"
                  required
                />
                <Input
                  {...register("contatos", { value: dadosAluno?.contatos })}
                  label="Contatos"
                  required
                />

                {loadingAnexos === true ? (
                  <Spinner />
                ) : (
                  <Input
                    onChange={(value) => {
                      setFiles(value.target.files);
                    }}
                    label="Anexar documentos"
                    type="file"
                    multiple
                  />
                )}

                <Button color="danger" variant="light" onPress={onClose}>
                  Fechar
                </Button>
                <Button isLoading={loading} type="submit" color="primary">
                  {loading === true ? "Editando..." : "Editar"}
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
