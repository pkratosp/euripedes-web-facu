"use client";

import { api } from "@/lib/axios";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  token: string;
}

const ocorrenciaSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  alunoId: z.string(),
});

type OcorrenciaType = z.infer<typeof ocorrenciaSchema>;

export function RegistrarOcorrencia({ isOpen, onOpenChange, token }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAlunos, setLoadingAlunos] = useState<boolean>(false);
  const [alunos, setAlunos] = useState<Array<{ nome: string; id: string }>>([]);

  const { control, register, handleSubmit, reset } = useForm<OcorrenciaType>({
    resolver: zodResolver(ocorrenciaSchema),
  });

  async function handleRegistrarOcorrencia(data: OcorrenciaType) {
    try {
      setLoading(true);
      await api.post(
        "/ocorrencias",
        {
          titulo: data.titulo,
          descricao: data.descricao,
          alunoId: data.alunoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Ocorrencia registrada com sucesso!");
      reset();
    } catch (error) {
      toast.error("Ocorreu um erro criar ocorrencia");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getAlunosSelect() {
      try {
        setLoadingAlunos(true);

        const response = await api.get<{
          alunos: Array<{ id: string; nome: string }>;
        }>("/alunos/nomes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setAlunos(response.data.alunos);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar alunos");
      } finally {
        setLoadingAlunos(false);
      }
    }

    if (isOpen) {
      getAlunosSelect();
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
              Registrar ocorrencia
            </ModalHeader>
            <ModalBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleRegistrarOcorrencia)}
              >
                <Input {...register("titulo")} label="Titulo" required />
                <Textarea
                  {...register("descricao")}
                  label="Descrição"
                  required
                />

                {loadingAlunos === true ? (
                  <Spinner />
                ) : (
                  <Controller
                    name="alunoId"
                    control={control}
                    render={({ field: { name, onBlur, onChange, value } }) => (
                      <Autocomplete
                        name={name}
                        className="w-full"
                        defaultItems={alunos}
                        label="lista dos alunos"
                        placeholder="Digite o nome do aluno"
                        listboxProps={{
                          emptyContent: "Aluno não encontrado",
                        }}
                        onBlur={onBlur}
                        onSelectionChange={onChange}
                        value={value}
                        required={true}
                      >
                        {(aluno) => (
                          <AutocompleteItem key={aluno.id}>
                            {aluno.nome}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                )}

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
