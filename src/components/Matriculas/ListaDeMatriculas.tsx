"use client";

import { api } from "@/lib/axios";
import { Button, Pagination, useDisclosure } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { MatriculasDto } from "@/dto/matriculasDto";
import { InformacoesAluno } from "./InformacoesAluno";
import { EditarMatricula } from "./EditarMatricula";
import { Desmatricular } from "./Desmatricular";
import { Rematricular } from "./Rematricular";

interface MatriculasType {
  matriculas: MatriculasDto[];
  total: number;
}

interface Props {
  token: string;
  search: string;
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

export function ListaDeMatriculas({ search, token }: Props) {
  const informacoesAluno = useDisclosure();
  const editarMatricula = useDisclosure();
  const desmatricular = useDisclosure();
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

  const [page, setPage] = useState<number>(1);

  const fetcher = (url: string) =>
    api
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data)
      .catch(() => toast.error("Ocorreu um erro ao listar dados"));

  const {
    data,
    isLoading,
  }: {
    data: MatriculasType;
    isLoading: boolean;
  } = useSWR(`${api.defaults.baseURL}/matriculas?page=${page}`, fetcher, {
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

              <Button
                className="w-1/4"
                onPress={() => {
                  setMatricula(matricula);
                  setAluno(aluno);
                  desmatricular.onOpen();
                }}
              >
                Desmatricular
              </Button>
            </div>
          );
      }
    },
    []
  );

  async function buscarMatriculaNomeAluno(search: string) {
    try {
      const request = await api.get(`/matriculas/${search}`, {
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
    <Fragment>
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

      <Desmatricular
        isOpen={desmatricular.isOpen}
        onOpenChange={desmatricular.onOpenChange}
        token={token}
        nomeAluno={aluno?.nome ?? "Aluno não definido"}
        matriculaId={matricula?.id ?? ""}
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
    </Fragment>
  );
}
