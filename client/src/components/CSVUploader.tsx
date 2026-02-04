import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CSVUploaderProps {
  onUrlsExtracted: (urls: string[]) => void;
  isProcessing: boolean;
}

export function CSVUploader({ onUrlsExtracted, isProcessing }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (content: string): string[] => {
    const lines = content.split('\n');
    const urls: string[] = [];

    // Try to detect if it's a proper CSV with headers
    let startIndex = 0;
    const firstLine = lines[0]?.trim().toLowerCase() || '';
    
    // Check if first line looks like a header
    if (firstLine.includes('url') || firstLine.includes('link') || firstLine.includes('video')) {
      startIndex = 1;
    }

    // Extract URLs from each line
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i]?.trim();
      if (!line) continue;

      // Handle CSV format (might have quotes)
      const url = line.replace(/^["']|["']$/g, '').trim();

      // Validate if it looks like a URL
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        urls.push(url);
      }
    }

    return urls;
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Por favor, selecione um arquivo CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const urls = parseCSV(content);

        if (urls.length === 0) {
          toast.error('Nenhuma URL de YouTube encontrada no arquivo CSV');
          return;
        }

        toast.success(`${urls.length} URL(s) encontrada(s)`);
        onUrlsExtracted(urls);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast.error('Erro ao processar arquivo CSV');
        console.error(error);
      }
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de CSV</CardTitle>
        <CardDescription>
          Faça upload de um arquivo CSV com URLs de vídeos do YouTube Shorts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            {isProcessing ? (
              <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400" />
            )}

            <div>
              <p className="font-medium text-slate-900">
                {isProcessing ? 'Processando...' : 'Arraste um arquivo CSV aqui'}
              </p>
              <p className="text-sm text-slate-600">ou clique para selecionar</p>
            </div>

            {!isProcessing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar Arquivo
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Formato esperado:</p>
            <p>Uma URL por linha, ou um CSV com coluna "url" contendo os links</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
