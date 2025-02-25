"use client";

import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { clsx } from "clsx";

interface Props {
  token: string;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

const matriculasSchema = z.object({
  atendido: z.string(),
  telefoneMae: z.string(),
  telefonePai: z.string().nullish(),
  telefoneRecado: z.string().nullish(),
  responsavelLegal: z.string(),
  anoMatricula: z.string(),
  alunoId: z.string(),
});

type MatriculaType = z.infer<typeof matriculasSchema>;

export type PergutnasType = {
  id: string;
  titulo: string;
  descricao: string;
  respostas: Array<{
    id: string;
    resposta: string;
    perguntasId: string;
  }>;
};

export type RespostaType = {
  perguntasId: string;
  matriculaId: string;
  resposta: string;
};

export type RespostaStateType = {
  [key: string]: RespostaType;
};

export default function MatricularAluno({
  token,
  isOpen,
  onClose,
  onOpenChange,
}: Props) {
  const { register, handleSubmit, formState, reset, control } =
    useForm<MatriculaType>({
      resolver: zodResolver(matriculasSchema),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const [filesId, setFilesId] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [alunos, setAlunos] = useState<Array<{ nome: string; id: string }>>([]);
  const [loadingAlunos, setLoadingAlunos] = useState<boolean>(false);
  const [loadingAnexos, setLoadingAnexos] = useState<boolean>(false);
  const [loadingPerguntas, setLoadingPerguntas] = useState<boolean>(false);

  const [etapa, setEtapa] = useState<1 | 2>(1);

  const [matriculaId, setMatriculaId] = useState<string>("");
  const [perguntas, setPerguntas] = useState<PergutnasType[]>([]);
  const [respostas, setRespostas] = useState<RespostaStateType>({});

  function cleanFileId() {
    setFilesId([]);
  }

  async function handleMatricularAluno(data: MatriculaType) {
    try {
      setLoading(true);

      const responseMatricula = await api.post(
        "/matriculas",
        {
          alunoId: data.alunoId,
          atendido: data.atendido,
          telefoneMae: data.telefoneMae,
          telefonePai: data.telefonePai?.length === 0 ? null : data.telefonePai,
          telefoneRecado:
            data.telefoneRecado?.length === 0 ? null : data.telefoneRecado,
          responsavelLegal: data.responsavelLegal,
          anoMatricula: +data.anoMatricula,
          documentos: filesId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatriculaId(responseMatricula.data.id);

      reset();
      toast.success("O aluno foi matriculado com sucesso");
      setEtapa(2);
    } catch (error) {
      toast.error("Ocorreu um erro ao matricular aluno");
    } finally {
      setLoading(false);
    }
  }

  async function handlePerguntasMatriculas(event: any) {
    event.preventDefault();
    try {
      setLoading(true);

      for (const resposta in respostas) {
        await api.post(
          "/formulario/resposta",
          {
            resposta: respostas[resposta].resposta,
            perguntasId: respostas[resposta].perguntasId,
            matriculaId: respostas[resposta].matriculaId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setRespostas({});
      toast.success("Respostas registradas com sucesso");
      onClose();
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao responder perguntas");
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
      cleanFileId();
      getAlunosSelect();
      setMatriculaId("");
    }
  }, [isOpen]);

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
    async function hangleBuscarPerguntas() {
      try {
        setLoadingPerguntas(true);

        const response = await api.get("/perguntas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerguntas(response.data.perguntas);
      } catch (error) {
        toast.error("Ocorreu um erro ao carregar as perguntas de matricula");
      } finally {
        setLoadingPerguntas(false);
      }
    }

    if (etapa === 2) {
      hangleBuscarPerguntas();
    }
  }, [etapa]);

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior={"inside"}
      onOpenChange={() => {
        if (matriculaId === "") {
          toast("Atenção", {
            description:
              "Você não finalizou a matricula, deseja mesmo sair sem finalizar?",
            action: {
              label: "Sim",
              onClick: () => {
                onOpenChange();
                reset();
              },
            },
          });
        }
      }}
      size="5xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Matricular Aluno
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-1 space-x-5 justify-center">
                <button
                  onClick={() => setEtapa(1)}
                  className={clsx(
                    "w-10 text-white flex justify-center items-center h-10 rounded-full",
                    {
                      "bg-slate-500": etapa !== 1,
                      "bg-blue-500": etapa === 1,
                    }
                  )}
                >
                  1
                </button>
                <button
                  onClick={() => {
                    if (matriculaId === "") {
                      toast.warning(
                        "Atenção, preencha todas as informações base da matricula para adicionar novas informações"
                      );
                    } else {
                      setEtapa(2);
                    }
                  }}
                  className={clsx(
                    "w-10 bg-blue-500 text-white flex justify-center items-center h-10 rounded-full",
                    {
                      "bg-slate-500": etapa !== 2,
                      "bg-blue-500": etapa === 2,
                    }
                  )}
                >
                  2
                </button>
              </div>

              <form
                onSubmit={
                  etapa === 1
                    ? handleSubmit(handleMatricularAluno)
                    : handlePerguntasMatriculas
                }
              >
                {etapa === 1 ? (
                  <div className="space-y-4">
                    <Input
                      {...register("atendido")}
                      label="atendido"
                      required
                    />

                    <Input
                      {...register("telefoneMae")}
                      label="Telefone da mãe"
                      required
                    />

                    <Input
                      {...register("telefonePai")}
                      label="Telefone do pai"
                    />

                    <Input
                      {...register("telefoneRecado")}
                      label="Telefone recado"
                      required
                    />

                    <Input
                      {...register("responsavelLegal")}
                      label="Responsavel legal"
                      required
                    />

                    <Input
                      {...register("anoMatricula")}
                      label="Ano da matricula"
                      required
                    />

                    {loadingAlunos === true ? (
                      <Spinner />
                    ) : (
                      <Controller
                        name="alunoId"
                        control={control}
                        render={({
                          field: { name, onBlur, onChange, value },
                        }) => (
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
                  </div>
                ) : etapa === 2 ? (
                  loadingPerguntas === true ? (
                    <Spinner />
                  ) : (
                    <div>
                      {perguntas.map((pergunta) => (
                        <Input
                          key={pergunta.id}
                          label={pergunta.titulo}
                          description={pergunta.descricao}
                          onChange={(value) => {
                            setRespostas((state) => {
                              state[pergunta.id] = {
                                matriculaId: matriculaId,
                                perguntasId: pergunta.id,
                                resposta: value.target.value,
                              };

                              return state;
                            });
                          }}
                        />
                      ))}
                    </div>
                  )
                ) : null}

                <div className="space-x-2 pt-4">
                  <Button
                    isLoading={loading}
                    color="danger"
                    variant="light"
                    onPress={onClose}
                  >
                    Fechar
                  </Button>
                  <Button isLoading={loading} type="submit" color="primary">
                    {etapa === 1 ? "Matricular" : "Salvar perguntas"}
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
