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
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";

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

export default function MatricularAluno({
  token,
  isOpen,
  onClose,
  onOpenChange,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MatriculaType>({
    resolver: zodResolver(matriculasSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [alunos, setAlunos] = useState<Array<{ nome: string; id: string }>>([]);
  const [loadingAlunos, setLoadingAlunos] = useState<boolean>(false);

  async function handleMatricularAluno(data: MatriculaType) {
    try {
      setLoading(true);

      await api.post(
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      reset();
      toast.success("O aluno foi matriculado com sucesso");
      onClose();
    } catch (error) {
      toast.error("Ocorreu um erro ao matricular aluno");
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
              Cadastrar aluno
            </ModalHeader>
            <ModalBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleMatricularAluno)}
              >
                <Input
                  {...register("atendido", { required: true })}
                  label="atendido"
                />
                <Input
                  {...register("telefoneMae", { required: true })}
                  label="Telefone da mãe"
                />
                <Input
                  {...register("telefonePai", { required: false })}
                  label="Telefone do pai"
                />
                <Input
                  {...register("telefoneRecado", { required: true })}
                  label="Telefone recado"
                />
                <Input
                  {...register("responsavelLegal", { required: true })}
                  label="Responsavel legal"
                />
                <Input
                  {...register("anoMatricula", { required: true })}
                  label="Ano da matricula"
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
                  Matricular
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
