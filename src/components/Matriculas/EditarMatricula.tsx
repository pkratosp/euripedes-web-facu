"use client";

import { MatriculasDto } from "@/dto/matriculasDto";
import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
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
  atendido: z.string(),
  telefoneMae: z.string(),
  telefonePai: z.string().nullish(),
  telefoneRecado: z.string().nullish(),
  responsavelLegal: z.string(),
});

type EditarMatriculaType = z.infer<typeof editarMatricula>;

export function EditarMatricula({
  isOpen,
  onOpenChange,
  aluno,
  token,
  matricula,
}: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [filesId, setFilesId] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAnexos, setLoadingAnexos] = useState<boolean>(false);

  const { register, handleSubmit, setValue, reset } =
    useForm<EditarMatriculaType>({});

  async function handleEditarMatricula(data: EditarMatriculaType) {
    try {
      setLoading(true);

      await api.put(
        `/matriculas/${matricula?.id}`,
        {
          ...data,
          documentos: filesId,
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

  useEffect(() => {
    async function handleAnexarDocumentos() {
      try {
        setLoadingAnexos(true);

        let initFile = 0;
        const filesCount = files?.length ?? 0;

        while (initFile < filesCount) {
          if (files !== null) {
            const formData = new FormData();

            formData.append("file", files[initFile]);

            const responseDocumento = await api.post<{ idDocumento: string }>(
              "/upload/documento",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setFilesId((state) => [
              ...state,
              responseDocumento.data.idDocumento,
            ]);
          }

          initFile++;
        }
        toast.success("Documentos anexados com sucesso!");
      } catch (error) {
        toast.error("Ocorreu um erro ao anexar arquivos");
      } finally {
        setLoadingAnexos(false);
      }
    }

    if (files !== null) {
      handleAnexarDocumentos();
    }
  }, [files]);

  useEffect(() => {
    if (isOpen === true) {
      reset();
      setValue("atendido", matricula?.atendido ?? "");
      setValue("responsavelLegal", matricula?.responsavelLegal ?? "");
      setValue("telefoneMae", matricula?.telefoneMae ?? "");
      setValue("telefonePai", matricula?.telefonePai ?? "");
      setValue("telefoneRecado", matricula?.telefoneRecado ?? "");
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
              Editar Matricula do aluno {aluno?.nome}
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(handleEditarMatricula)}
                className="space-y-4"
              >
                <Input {...register("atendido")} label="atendido" required />

                <Input
                  {...register("telefoneMae")}
                  label="Telefone da mãe"
                  required
                />

                <Input {...register("telefonePai")} label="Telefone do pai" />

                <Input
                  {...register("telefoneRecado", {
                    value: matricula?.telefoneRecado,
                  })}
                  label="Telefone recado"
                  required
                />

                <Input
                  {...register("responsavelLegal")}
                  label="Responsavel legal"
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

                <div className="space-x-2 pt-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button isLoading={loading} type="submit" color="primary">
                    Editar matricula
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
