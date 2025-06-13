import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import ContainerMatricula from "@/components/Matriculas/ContainerMatricula";
import { getServerSession } from "next-auth";

export default async function Matriculas() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div>
      <h2 className="text-2xl font-bold">Matrículas</h2>

      <ContainerMatricula token={session?.access_token ?? ""} />
    </div>
  );
}
