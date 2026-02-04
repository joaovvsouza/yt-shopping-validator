import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ExportButtonProps {
  format: 'csv' | 'excel';
  disabled?: boolean;
}

export function ExportButton({ format, disabled = false }: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const exportMutation = trpc.reports.exportToCSV.useMutation();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const result = await exportMutation.mutateAsync({ format });

      // Create blob from base64
      const binaryString = atob(result.buffer);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.mimeType });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Relatório exportado como ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Erro ao exportar relatório: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Exportar {format.toUpperCase()}
        </>
      )}
    </Button>
  );
}
