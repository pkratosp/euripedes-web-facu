import { MatriculasDto } from "@/dto/matriculasDto";
import { api } from "@/lib/axios";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { InformacoesAluno } from "./InformacoesAluno";
import { EditarMatricula } from "./EditarMatricula";
import { Rematricular } from "./Rematricular";
import { Desmatricular } from "./Desmatricular";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Input, Pagination, Spinner } from "@heroui/react";

interface MatriculasType {
  matriculas: MatriculasDto[];
  total: number;
}

interface Props {
  token: string;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

const columns = [
  {
    key: "nomeAluno",
    label: "Nome do aluno",
  },
  {
    key: "atendido",
    label: "atendido",
  },
  {
    key: "telefoneMae",
    label: "telefone da Mãe",
  },
  {
    key: "telefonePai",
    label: "telefone do pai",
  },
  {
    key: "telefoneRecado",
    label: "telefone recado",
  },
  {
    key: "responsavelLegal",
    label: "resposavel legal",
  },
  {
    key: "anoMatricula",
    label: "ano matricula",
  },
  {
    key: "ações",
    label: "ações",
  },
];

export function Desmatriculados({
  isOpen,
  onClose,
  onOpenChange,
  token,
}: Props) {
  const informacoesAluno = useDisclosure();
  const editarMatricula = useDisclosure();
  const rematricular = useDisclosure();

  const [matricula, setMatricula] = useState<Omit<
    MatriculasDto,
    "aluno"
  > | null>(null);
  const [aluno, setAluno] = useState<{ nome: string; id: string } | null>(null);

  const [matriculas, setMatriculas] = useState<MatriculasType>({
    matriculas: [],
    total: 0,
  });

  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState<number>(1);

  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data)
      .catch(() => toast.error("Ocorreu um erro ao listar dados"));

  const {
    isLoading,
  }: {
    data: MatriculasType;
    isLoading: boolean;
  } = useSWR(`/desmatriculados?page=${page}`, fetcher, {
    keepPreviousData: true,
    onSuccess: (data: MatriculasType) => {
      setMatriculas(data);
    },
  });

  const rowsPerPage = 20;

  const pages = useMemo(() => {
    return matriculas?.total ? Math.ceil(matriculas.total / rowsPerPage) : 0;
  }, [matriculas?.total, rowsPerPage]);

  const loadingState =
    isLoading || matriculas?.matriculas?.length === 0 ? "loading" : "idle";

  const renderCell = useCallback(
    (
      matricula: Omit<MatriculasDto, "aluno">,
      columKey: React.Key,
      aluno: { nome: string; id: string }
    ) => {
      const cellValue =
        matricula[columKey as keyof Omit<MatriculasDto, "aluno">];

      switch (columKey) {
        case "nomeAluno":
          return <p>{aluno.nome}</p>;
        case "atendido":
          return <p>{cellValue}</p>;

        case "telefoneMae":
          return <p>{cellValue}</p>;

        case "telefonePai":
          return <p>{cellValue}</p>;

        case "telefoneRecado":
          return <p>{cellValue}</p>;

        case "responsavelLegal":
          return <p>{cellValue}</p>;

        case "anoMatricula":
          return <p>{cellValue}</p>;

        case "ações":
          return (
            <div className="flex-1 space-x-1">
              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  informacoesAluno.onOpen();
                }}
              >
                Informações
              </Button>

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  editarMatricula.onOpen();
                }}
              >
                Editar matricula
              </Button>

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  rematricular.onOpen();
                }}
              >
                Rematricular
              </Button>
            </div>
          );
      }
    },
    []
  );

  async function buscarMatriculaNomeAluno(search: string) {
    try {
      const request = await api.get(`/desmatriculados/${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatriculas(request.data);
    } catch (error) {
      toast.error(`Ocorreu um erro ao consultar matricula do aluno ${search}`);
    }
  }

  useEffect(() => {
    const findSearch = setTimeout(() => {
      if (search.trim() !== "") {
        buscarMatriculaNomeAluno(search);
      } else {
        buscarMatriculaNomeAluno("vazio");
      }
    }, 1000);

    return () => clearTimeout(findSearch);
  }, [search]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={"inside"}
      size="full"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Removidos</ModalHeader>
            <ModalBody>
              <div className="flex items-center justify-end">
                <Input
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  className="w-1/3 p-4"
                  placeholder="Pesquisar..."
                />
              </div>

              <InformacoesAluno
                isOpen={informacoesAluno.isOpen}
                onOpenChange={informacoesAluno.onOpenChange}
                token={token}
                matriculaId={matricula?.id ?? ""}
                nomeAluno={aluno?.nome ?? "Aluno não definido"}
              />

              <EditarMatricula
                isOpen={editarMatricula.isOpen}
                onOpenChange={editarMatricula.onOpenChange}
                token={token}
                aluno={aluno}
                matricula={matricula}
              />

              <Rematricular
                isOpen={rematricular.isOpen}
                onOpenChange={rematricular.onOpenChange}
                token={token}
                aluno={aluno}
                matricula={matricula}
              />

              <Table
                aria-label="Lista matriculas dos alunos cadastrados"
                bottomContent={
                  pages > 0 ? (
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  emptyContent={<span>Não há nenhum aluno cadastrado</span>}
                  items={matriculas?.matriculas ?? []}
                  loadingContent={<Spinner />}
                  loadingState={loadingState}
                >
                  {(matricula) => (
                    <TableRow key={matricula.id}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCell(matricula, columnKey, matricula.aluno)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
