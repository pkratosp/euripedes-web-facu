import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { DocumentosArquivo } from "@/components/Documentos/DocumentosArquivo";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Documentos({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return redirect("/login");
  }

  return (
    <main>
      <DocumentosArquivo
        documentoId={searchParams.documentoId}
        token={session.access_token}
      />
    </main>
  );
}
