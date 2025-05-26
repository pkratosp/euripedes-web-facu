"use client";
import { api } from "@/lib/axios";
import { Pagination } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";

const columns = [
  {
    key: "titulo",
    label: "titulo",
  },
  {
    key: "descricao",
    label: "descricao",
  },
];

interface Props {
  token: string;
}

export function ListaDePerguntas({ token }: Props) {
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
    data: any;
    isLoading: boolean;
  } = useSWR(`/perguntas?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 20;

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
  }, [data?.total, rowsPerPage]);

  const loadingState =
    isLoading || data?.pergunas?.length === 0 ? "loading" : "idle";

  return (
    <Table
      aria-label="Lista das perguntas cadastradas"
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
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent={<span>Não há nenhuma pergunta cadastrada</span>}
        items={data?.perguntas ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
