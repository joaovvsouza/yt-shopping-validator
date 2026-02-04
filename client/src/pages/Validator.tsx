import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash2, Download } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { CSVUploader } from '@/components/CSVUploader';
import * as XLSX from 'xlsx';

type ProcessedVideo = {
  id: string;
  youtubeUrl: string;
  videoId: string;
  title: string;
  description: string;
  creator: string;
  productCount: number;
  products: Array<{
    title: string;
    price: string;
    imageUrl?: string;
    productUrl?: string;
    store?: string;
  }>;
  processedAt: string;
};

export default function Validator() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  const processVideoMutation = trpc.videos.processVideo.useMutation({
    onSuccess: (result) => {
      if (result.success && result.data) {
        const newVideo: ProcessedVideo = {
          id: `video-${Date.now()}-${Math.random()}`,
          youtubeUrl: result.data.youtubeUrl,
          videoId: result.data.videoId,
          title: result.data.title || 'Sem título',
          description: result.data.description || '',
          creator: result.data.creator || '',
          productCount: result.data.products?.length || 0,
          products: result.data.products || [],
          processedAt: result.data.processedAt || new Date().toISOString(),
        };
        setVideos((prev) => [newVideo, ...prev]);
        toast.success('Vídeo processado com sucesso!');
        setVideoUrl('');
      }
    },
    onError: (error) => {
      toast.error(`Erro ao processar vídeo: ${error.message}`);
    },
  });

  const handleProcessSingle = async () => {
    if (!videoUrl.trim()) {
      toast.error('Por favor, insira uma URL de vídeo');
      return;
    }

    setIsProcessing(true);
    try {
      await processVideoMutation.mutateAsync({
        url: videoUrl,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessBulk = async () => {
    const urls = bulkUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      toast.error('Por favor, insira pelo menos uma URL');
      return;
    }

    setIsProcessing(true);
    try {
      for (const url of urls) {
        await processVideoMutation.mutateAsync({
          url,
        });
      }
      setBulkUrls('');
      toast.success(`${urls.length} vídeos processados!`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    toast.success('Vídeo removido');
  };

  const handleExport = (format: 'csv' | 'excel') => {
    if (videos.length === 0) {
      toast.error('Nenhum vídeo para exportar');
      return;
    }

    // Find maximum number of products to determine column count
    const maxProducts = Math.max(...videos.map(v => v.products?.length || 0), 0);
    
    // Helper function to clean and truncate product names
    const cleanProductName = (name: string, maxLength: number = 50): string => {
      if (!name) return '';
      // Remove extra whitespace and newlines
      let cleaned = name.trim().replace(/\s+/g, ' ').replace(/\n/g, ' ');
      // Truncate if too long
      if (cleaned.length <= maxLength) return cleaned;
      return cleaned.substring(0, maxLength - 3) + '...';
    };
    
    // Create export data: one row per video, with separate columns for each product
    const exportData: any[] = videos.map((video) => {
      const row: any = {
        'Link do Vídeo': video.youtubeUrl || '',
      };
      
      // Add product columns (Produto 1, Produto 2, etc.)
      // Ensure each product goes to its own column
      if (video.products && video.products.length > 0) {
        for (let i = 0; i < maxProducts; i++) {
          const product = video.products[i];
          if (product && product.title) {
            // Clean and truncate product name
            row[`Produto ${i + 1}`] = cleanProductName(product.title);
          } else {
            row[`Produto ${i + 1}`] = '';
          }
        }
      } else {
        // No products, fill with empty strings
        for (let i = 0; i < maxProducts; i++) {
          row[`Produto ${i + 1}`] = '';
        }
      }
      
      return row;
    });
    
    const data = exportData;

    const ws = XLSX.utils.json_to_sheet(data, { 
      cellStyles: false,
      dateNF: 'dd/mm/yyyy'
    });
    
    // Configure column widths for Excel (only works for .xlsx)
    if (format === 'excel' && maxProducts > 0) {
      const colWidths: { wch: number }[] = [];
      
      // Link do Vídeo column - wider for URLs
      colWidths.push({ wch: 45 });
      
      // Product columns - consistent medium width
      for (let i = 0; i < maxProducts; i++) {
        colWidths.push({ wch: 35 });
      }
      
      ws['!cols'] = colWidths;
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Validações');

    const fileName = `validacoes_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`;
    const buffer = XLSX.write(wb, { bookType: format === 'excel' ? 'xlsx' : 'csv', type: 'buffer' });

    const blob = new Blob([buffer], {
      type: format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Relatório exportado como ${format.toUpperCase()}`);
  };

  const stats = useMemo(() => ({
    total: videos.length,
    totalProducts: videos.reduce((sum, v) => sum + v.productCount, 0),
  }), [videos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">YouTube Shopping Validator</h1>
          <p className="text-slate-600">
            Valide vídeos do YouTube Shorts e extraia produtos tagueados automaticamente
          </p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Modo sem persistência:</strong> Os dados são armazenados apenas na memória. 
              Ao recarregar a página, todos os dados serão perdidos.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Vídeos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Produtos Encontrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Processar Vídeos</CardTitle>
            <CardDescription>Insira URLs de vídeos do YouTube Shorts para validação</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="csv" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="csv">CSV</TabsTrigger>
                <TabsTrigger value="single">Individual</TabsTrigger>
                <TabsTrigger value="bulk">Múltiplos</TabsTrigger>
              </TabsList>

              <TabsContent value="csv" className="space-y-4">
                <CSVUploader
                  onUrlsExtracted={async (urls) => {
                    setIsProcessing(true);
                    try {
                      for (const url of urls) {
                        await processVideoMutation.mutateAsync({
                          url,
                        });
                      }
                      toast.success(`${urls.length} vídeos processados!`);
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="single" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">URL do Vídeo</label>
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>

                <Button
                  onClick={handleProcessSingle}
                  disabled={isProcessing || !videoUrl.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Processar Vídeo
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">URLs (uma por linha)</label>
                  <textarea
                    placeholder="https://youtube.com/shorts/...&#10;https://youtube.com/shorts/..."
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                    disabled={isProcessing}
                    className="w-full min-h-32 p-3 border border-slate-200 rounded-lg font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleProcessBulk}
                  disabled={isProcessing || !bulkUrls.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Processar Todos
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Histórico de Validações</CardTitle>
              <CardDescription>Vídeos processados e seus produtos (dados em memória)</CardDescription>
            </div>
            {videos.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('excel')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} onDelete={handleDeleteVideo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Nenhum vídeo processado ainda. Comece adicionando um vídeo acima.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VideoCard({ video, onDelete }: { video: ProcessedVideo; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{video.title || 'Vídeo sem título'}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              {video.productCount} produtos
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {video.creator && `Creator: ${video.creator}`}
          </p>
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-700 block mt-1"
          >
            {video.youtubeUrl}
          </a>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(video.processedAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ocultar' : 'Ver Detalhes'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(video.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">Produtos Encontrados</h4>
          {video.products && video.products.length > 0 ? (
            <div className="space-y-2">
              {video.products.map((product, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-200 hover:bg-slate-100 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm mb-1">{product.title}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 font-semibold">{product.price}</p>
                        {product.store && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                            {product.store}
                          </span>
                        )}
                      </div>
                      {product.productUrl ? (
                        <a
                          href={product.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium underline mt-1"
                        >
                          🔗 Ver produto
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-1">Link não disponível</p>
                      )}
                    </div>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded border border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Nenhum produto encontrado</p>
          )}
        </div>
      )}
    </div>
  );
}
