import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabriela Prieto | Produção Executiva Musical",
  description: "Sistema de Gestão Integrada para Produtora de Eventos e Agenciamento Artístico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#34313B]">
        {children}
      </body>
    </html>
  );
}
