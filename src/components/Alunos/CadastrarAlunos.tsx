"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { DateInput } from "@heroui/react";
import {
  parseDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
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

      setTimeout(() => {
        window.document.location.reload();
      }, 1500);
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
              Cadastrar atendido
            </ModalHeader>
            <ModalBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleCadastrarAlunos)}
              >
                <Input {...register("nome")} label="Nome do aluno" required />
                <Input {...register("ra")} label="RA" required />
                <Input {...register("nis")} label="NIS" required />
                <Input {...register("cpf")} label="CPF" required />
                <Input {...register("rg")} label="RG" required />

                <Input
                  {...register("dataNascimento")}
                  label="Data de nascimento"
                  required
                />

                <Input
                  {...register("naturalidade")}
                  label="Naturalidade"
                  required
                />
                <Input {...register("estado")} label="Estado" required />
                <Input {...register("endereco")} label="Endereço" required />
                <Input {...register("bairro")} label="Bairro" required />
                <Input {...register("cep")} label="CEP" required />
                <Input {...register("escola")} label="Escola" required />
                <Input
                  {...register("serieEscola")}
                  label="Série da escola"
                  required
                />
                <Input
                  {...register("ultimaProcedencia")}
                  label="Ultima procedencia"
                  required
                />
                <Input
                  {...register("responsavel")}
                  label="Nome do Responsável"
                  required
                />
                <Input
                  {...register("rgResponsavel")}
                  label="Rg do Responsável"
                  required
                />
                <Input
                  {...register("cpfResponsavel")}
                  label="CPF do Responsável"
                  required
                />
                <Input
                  {...register("filiacaoMae")}
                  label="Filiação mãe"
                  required
                />
                <Input {...register("pai")} label="Pai" />
                <Input {...register("contatos")} label="Contatos" required />

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
