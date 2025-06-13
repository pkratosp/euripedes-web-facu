import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { ContainerFormulario } from "@/components/Formularios/ContainerFormulario";
import { getServerSession } from "next-auth";

export default async function Formularios() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div>
      <h2 className="text-2xl font-bold">Formulários</h2>

      <ContainerFormulario token={session?.access_token ?? ""} />
    </div>
  );
}
