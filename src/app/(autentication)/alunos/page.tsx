import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { ContainerAluno } from "@/components/Alunos/ContainerAluno";
import { getServerSession } from "next-auth";

export default async function Alunos() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div>
      <h2 className="text-2xl font-bold">Atendidos</h2>

      <ContainerAluno token={session?.access_token ?? ""} />
    </div>
  );
}
