"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Spinner } from "@heroui/spinner";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
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

const cadastrarAlunoSchema = z.object({
  nome: z.string(),
  sexo: z.string(),
  nis: z.string(),
  dataNascimento: z.string(),
  rg: z.string(),
  cpf: z.string(),
  filiacaoMae: z.string(),
  pai: z.string().optional(),
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

type CadastrarAlunoType = z.infer<typeof cadastrarAlunoSchema>;

export function CadastrarAlunos({
  isOpen,
  onClose,
  onOpenChange,
  token,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CadastrarAlunoType>({
    resolver: zodResolver(cadastrarAlunoSchema),
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [filesId, setFilesId] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAnexos, setLoadingAnexos] = useState<boolean>(false);

  function cleanFileId() {
    setFilesId([]);
  }

  async function handleCadastrarAlunos(data: CadastrarAlunoType) {
    try {
      setLoading(true);

      await api.post(
        "aluno",
        {
          ...data,
          documentos: filesId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      reset();
      onClose();

      toast.success("Aluno cadastrado com sucesso!");
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar cadastrar o aluno");
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
    cleanFileId();
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
              Cadastrar aluno
            </ModalHeader>
            <ModalBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleCadastrarAlunos)}
              >
                <Input
                  {...register("nome", { required: true })}
                  label="Nome do aluno"
                />
                <Input {...register("ra", { required: true })} label="Ra" />
                <Input {...register("nis", { required: true })} label="nis" />
                <Input {...register("cpf", { required: true })} label="CPF" />
                <Input {...register("rg", { required: true })} label="RG" />
                <Input
                  {...register("dataNascimento", { required: true })}
                  label="data de nascimento"
                />
                <Input
                  {...register("naturalidade", { required: true })}
                  label="naturalidade"
                />
                <Input
                  {...register("estado", { required: true })}
                  label="estado"
                />
                <Input
                  {...register("endereco", { required: true })}
                  label="endereço"
                />
                <Input
                  {...register("bairro", { required: true })}
                  label="bairro"
                />
                <Input {...register("cep", { required: true })} label="cep" />
                <Input
                  {...register("escola", { required: true })}
                  label="escola"
                />
                <Input
                  {...register("serieEscola", { required: true })}
                  label="série da escola"
                />
                <Input
                  {...register("ultimaProcedencia", { required: true })}
                  label="Ultima procedencia"
                />
                <Input
                  {...register("responsavel", { required: true })}
                  label="Nome do responsavel"
                />
                <Input
                  {...register("rgResponsavel", { required: true })}
                  label="Rg do responsavel"
                />
                <Input
                  {...register("cpfResponsavel", { required: true })}
                  label="CPF do responsavel"
                />
                <Input
                  {...register("filiacaoMae", { required: true })}
                  label="Filiação mãe"
                />
                <Input {...register("pai", { required: false })} label="Pai" />
                <Input
                  {...register("contatos", { required: true })}
                  label="Contatos"
                />

                <Controller
                  name="sexo"
                  control={control}
                  render={({ field: { onBlur, name, onChange, value } }) => (
                    <Select
                      name={name}
                      onChange={onChange}
                      value={value}
                      onBlur={onBlur}
                      label="Selecione o sexo"
                      required={true}
                    >
                      {sexo.map((_sexo) => (
                        <SelectItem key={_sexo.key}>{_sexo.label}</SelectItem>
                      ))}
                    </Select>
                  )}
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
