import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

interface YouTubeProduct {
  title: string;
  price: string;
  imageUrl?: string;
  productUrl?: string;
  store?: string;
}

interface YouTubeVideoData {
  videoId: string;
  title: string;
  description: string;
  creator: string;
  products: YouTubeProduct[];
}

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  // If browser exists but is disconnected, create a new one
  if (browser) {
    try {
      const pages = await browser.pages();
      // Browser is still connected
      return browser;
    } catch {
      // Browser is disconnected, reset it
      browser = null;
    }
  }

  if (!browser) {
    const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
      timeout: 60000,
    };

    try {
      browser = await puppeteer.launch(launchOptions);
      
      // Handle browser disconnection
      browser.on('disconnected', () => {
        browser = null;
      });
      
      console.log('[Puppeteer] Browser launched successfully');
    } catch (error) {
      console.error('[Puppeteer] Failed to launch browser:', error);
      console.error('[Puppeteer] Launch options:', JSON.stringify(launchOptions, null, 2));
      throw new Error(`Não foi possível iniciar o navegador. Verifique se Chrome/Chromium está instalado.`);
    }
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

function extractVideoIdFromUrl(url: string): string | null {
  url = url.trim();
  
  // Handle youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle v=VIDEO_ID parameter anywhere
  const paramMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (paramMatch) return paramMatch[1];

  return null;
}

/**
 * Identifica a loja baseada no URL do produto
 */
function identifyStoreFromUrl(url: string): string {
  if (!url) return '';
  
  const urlLower = url.toLowerCase();
  
  // Lojas brasileiras principais
  if (urlLower.includes('shopee.com.br') || urlLower.includes('shopee.br')) {
    return 'Shopee';
  }
  if (urlLower.includes('mercadolivre.com.br') || urlLower.includes('mercadolivre.com')) {
    return 'Mercado Livre';
  }
  if (urlLower.includes('magazineluiza.com.br') || urlLower.includes('magalu.com')) {
    return 'Magazine Luiza';
  }
  if (urlLower.includes('amazon.com.br') || urlLower.includes('amazon.br')) {
    return 'Amazon';
  }
  if (urlLower.includes('americanas.com.br') || urlLower.includes('americanas.com')) {
    return 'Americanas';
  }
  if (urlLower.includes('casasbahia.com.br') || urlLower.includes('casasbahia.com')) {
    return 'Casas Bahia';
  }
  if (urlLower.includes('extra.com.br')) {
    return 'Extra';
  }
  if (urlLower.includes('pontofrio.com.br')) {
    return 'Ponto Frio';
  }
  if (urlLower.includes('submarino.com.br')) {
    return 'Submarino';
  }
  if (urlLower.includes('shoptime.com.br')) {
    return 'Shoptime';
  }
  if (urlLower.includes('carrefour.com.br')) {
    return 'Carrefour';
  }
  if (urlLower.includes('walmart.com.br')) {
    return 'Walmart';
  }
  if (urlLower.includes('riachuelo.com.br')) {
    return 'Riachuelo';
  }
  if (urlLower.includes('nike.com.br')) {
    return 'Nike';
  }
  if (urlLower.includes('adidas.com.br')) {
    return 'Adidas';
  }
  if (urlLower.includes('shein.com.br') || urlLower.includes('shein.com')) {
    return 'Shein';
  }
  if (urlLower.includes('aliexpress.com')) {
    return 'AliExpress';
  }
  if (urlLower.includes('dafiti.com.br')) {
    return 'Dafiti';
  }
  if (urlLower.includes('zattini.com.br')) {
    return 'Zattini';
  }
  if (urlLower.includes('netshoes.com.br')) {
    return 'Netshoes';
  }
  if (urlLower.includes('centauro.com.br')) {
    return 'Centauro';
  }
  
  // Tentar extrair domínio genérico
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace('www.', '');
    const domain = hostname.split('.')[0];
    
    // Capitalizar primeira letra
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return '';
  }
}

export async function extractYouTubeData(url: string): Promise<YouTubeVideoData> {
  const videoId = extractVideoIdFromUrl(url);
  if (!videoId) {
    throw new Error('URL do YouTube inválida');
  }

  let browser: Browser | null = null;
  let page: Awaited<ReturnType<Browser['newPage']>> | null = null;

  try {
    browser = await getBrowser();
    page = await browser.newPage();

    // Set a longer timeout and better error handling
    page.setDefaultNavigationTimeout(60000); // 60 seconds
    page.setDefaultTimeout(60000);

    // Navigate to the watch page with retry logic
    let retries = 2;
    let navigationSuccess = false;

    while (retries > 0 && !navigationSuccess) {
      try {
        await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
          waitUntil: 'domcontentloaded', // Changed from networkidle2 for faster loading
          timeout: 60000,
        });
        navigationSuccess = true;
      } catch (error: any) {
        retries--;
        if (retries === 0) {
          if (error.message?.includes('Navigation timeout') || error.message?.includes('net::ERR')) {
            throw new Error('Timeout ao carregar o vídeo do YouTube. Tente novamente.');
          }
          throw error;
        }
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Wait a bit for page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extract ytInitialData with retry
    let data: any = null;
    let dataRetries = 3;

    while (dataRetries > 0 && !data) {
      try {
        data = await page.evaluate(() => {
          return (window as any).ytInitialData;
        });

        if (!data) {
          // Try waiting a bit more
          await new Promise(resolve => setTimeout(resolve, 1000));
          data = await page.evaluate(() => {
            return (window as any).ytInitialData;
          });
        }
      } catch (error) {
        dataRetries--;
        if (dataRetries === 0) {
          throw new Error('Não foi possível extrair dados do YouTube. O vídeo pode estar privado ou indisponível.');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!data) {
      throw new Error('Não foi possível carregar dados do YouTube. Verifique se o vídeo está disponível.');
    }

    // Extract basic video info
    const title = data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[0]?.videoPrimaryInfoRenderer?.title?.runs?.[0]?.text || '';
    const description = data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer?.attributedDescription?.content || '';
    const creator = data.contents?.twoColumnWatchNextResults?.results?.results?.contents?.[1]?.videoSecondaryInfoRenderer?.videoDetails?.shortBylineText?.simpleText || '';

    // Extract shopping panel
    const shoppingPanel = data.engagementPanels?.find(
      (p: any) => p.engagementPanelSectionListRenderer?.panelIdentifier === 'shopping_panel_for_entry_point_9'
    );

    const products: YouTubeProduct[] = [];

    if (shoppingPanel?.engagementPanelSectionListRenderer?.content?.productListRenderer?.contents) {
      const contents = shoppingPanel.engagementPanelSectionListRenderer.content.productListRenderer.contents;

      contents.forEach((item: any, index: number) => {
        const productItem = item.productListItemRenderer;
        if (productItem) {
          // Try multiple paths to extract product URL
          let productUrl = '';
          
          // Path 1: onClickCommand -> commandExecutorCommand -> commands -> openUrlCommand
          if (productItem.onClickCommand?.commandExecutorCommand?.commands?.[0]?.openUrlCommand?.url) {
            productUrl = productItem.onClickCommand.commandExecutorCommand.commands[0].openUrlCommand.url;
          }
          // Path 2: navigationEndpoint -> urlCommand -> url
          else if (productItem.navigationEndpoint?.urlCommand?.url) {
            productUrl = productItem.navigationEndpoint.urlCommand.url;
          }
          // Path 3: commandMetadata -> webCommandMetadata -> url
          else if (productItem.onClickCommand?.commandMetadata?.webCommandMetadata?.url) {
            productUrl = productItem.onClickCommand.commandMetadata.webCommandMetadata.url;
          }
          // Path 4: Try to find URL in any command structure
          else if (productItem.onClickCommand) {
            const findUrlInObject = (obj: any): string => {
              if (typeof obj !== 'object' || obj === null) return '';
              if (obj.url && typeof obj.url === 'string' && obj.url.startsWith('http')) return obj.url;
              for (const key in obj) {
                const result = findUrlInObject(obj[key]);
                if (result) return result;
              }
              return '';
            };
            productUrl = findUrlInObject(productItem.onClickCommand);
          }
          
          // Decode YouTube URL if needed (YouTube URLs are often encoded)
          if (productUrl && productUrl.startsWith('/redirect')) {
            try {
              const urlParams = new URLSearchParams(productUrl.split('?')[1] || '');
              productUrl = urlParams.get('q') || urlParams.get('url') || productUrl;
            } catch {
              // Keep original URL if parsing fails
            }
          }
          
          // Extract store name from accessibilityTitle or identify from URL
          let storeName = productItem.accessibilityTitle?.split('from')?.pop()?.trim() || '';
          
          // If we have a productUrl, try to identify store from URL (more reliable)
          if (productUrl && !storeName) {
            storeName = identifyStoreFromUrl(productUrl);
          } else if (productUrl && storeName) {
            // If both exist, prefer URL-based identification as it's more accurate
            const urlStore = identifyStoreFromUrl(productUrl);
            if (urlStore) {
              storeName = urlStore;
            }
          }
          
          const product: YouTubeProduct = {
            title: productItem.title?.simpleText || '',
            price: productItem.price || '',
            imageUrl: productItem.thumbnail?.thumbnails?.[productItem.thumbnail.thumbnails.length - 1]?.url || '',
            store: storeName,
            productUrl: productUrl || undefined,
          };
          products.push(product);
        }
      });
    }

    return {
      videoId,
      title,
      description,
      creator,
      products,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    // Provide more helpful error messages
    if (errorMessage.includes('Connection closed') || errorMessage.includes('Target closed')) {
      throw new Error('Conexão com o navegador foi perdida. Tente novamente.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      throw new Error('Timeout ao processar vídeo. O vídeo pode estar muito longo ou a conexão está lenta.');
    }
    if (errorMessage.includes('net::ERR')) {
      throw new Error('Erro de conexão com o YouTube. Verifique sua internet e tente novamente.');
    }
    
    throw error;
  } finally {
    // Ensure page is closed even if there's an error
    try {
      if (page && !page.isClosed()) {
        await page.close();
      }
    } catch (closeError) {
      console.error('[Puppeteer] Error closing page:', closeError);
    }
  }
}

export function checkHashtagInDescription(description: string, hashtag: string): boolean {
  const normalizedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
  return description.toLowerCase().includes(normalizedHashtag.toLowerCase());
}
