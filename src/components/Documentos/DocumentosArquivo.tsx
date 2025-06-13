"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  documentoId: string | string[] | undefined;
  token: string;
}

export function DocumentosArquivo({ documentoId, token }: Props) {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);

  async function getImage() {
    const requestDocument = await fetch(
      `${process.env.api}/matriculas/documentos/${documentoId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (requestDocument.status === 401) {
      await signOut();
      return redirect("/login");
    }

    const buffer = await requestDocument.arrayBuffer();

    const blob = new Blob([buffer], {
      type: requestDocument.headers.get("Content-type") ?? "",
    });
    const documentUrl = URL.createObjectURL(blob);
    setImageURL(documentUrl);
    setContentType(requestDocument.headers.get("Content-type"));
  }

  useEffect(() => {
    getImage();
  }, []);

  return (
    <>
      {imageURL === null ? (
        <p>Carregando arquivo...</p>
      ) : contentType === "application/pdf" ? (
        <embed
          type="application/pdf"
          src={imageURL}
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
      ) : (
        <img
          src={imageURL}
          title="arquivo"
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
      )}
    </>
  );
}
