"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { DownloadExample } from "@/components/importar/download-example";
import { UploadFile } from "@/components/importar/upload-file";
import { ImportProcess } from "@/components/importar/import-process";
import { ImportInstructions } from "@/components/importar/import-instructions";

export default function ImportarPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleImportComplete = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <SiteHeader title="Importar Gastos" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DownloadExample />
          <UploadFile
            onFileSelect={handleFileSelect}
            onClear={handleClearFile}
            selectedFile={selectedFile}
          />
        </div>
        <ImportInstructions />

        {selectedFile && (
          <ImportProcess
            selectedFile={selectedFile}
            onImportComplete={handleImportComplete}
          />
        )}
      </div>
    </>
  );
}
