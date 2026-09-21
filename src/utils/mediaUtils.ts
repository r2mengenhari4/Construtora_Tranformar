/**
 * Utilitários para detecção, validação e carregamento de mídias (Imagens e Vídeos Curtos de até 30s)
 */

export interface VideoValidationResult {
  valid: boolean;
  isValid: boolean;
  duration: number;
  error?: string;
}

/**
 * Verifica se uma URL ou DataURL representa um formato de vídeo suportado
 */
export function isVideoMedia(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();

  // Data URLs
  if (clean.startsWith('data:video/')) return true;
  if (clean.startsWith('blob:') && clean.includes('video')) return true;

  // Remove querystrings e hashes para inspecionar extensão
  const urlWithoutParams = clean.split('?')[0].split('#')[0];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv'];
  
  if (videoExtensions.some(ext => urlWithoutParams.endsWith(ext))) {
    return true;
  }

  // URLs comuns de CDN de vídeo ou nomes de arquivo contendo formatos de vídeo
  if (clean.includes('.mp4?') || clean.includes('.webm?') || clean.includes('.mov?')) {
    return true;
  }

  return false;
}

/**
 * Valida a duração de um arquivo ou link de vídeo no navegador.
 * Limite estrito: até 30 segundos (tolerância de 0.8s para arredondamento de codecs).
 */
export function validateVideoDuration(
  fileOrUrl: File | string,
  maxDurationSeconds: number = 30
): Promise<VideoValidationResult> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';

      let objectUrl: string | null = null;
      if (typeof fileOrUrl === 'string') {
        video.src = fileOrUrl;
      } else {
        objectUrl = URL.createObjectURL(fileOrUrl);
        video.src = objectUrl;
      }

      const cleanup = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };

      // Timeout de segurança caso o vídeo não consiga ser decodificado em 8s
      const timer = setTimeout(() => {
        cleanup();
        // Se for URL externa com CORS bloqueando metadata, permitimos se for formato reconhecido
        resolve({
          valid: true,
          isValid: true,
          duration: 0,
          error: undefined
        });
      }, 8000);

      video.onloadedmetadata = () => {
        clearTimeout(timer);
        cleanup();
        const duration = video.duration;

        if (isNaN(duration) || duration === Infinity) {
          resolve({
            valid: true,
            isValid: true,
            duration: 0
          });
          return;
        }

        // Tolerância de 0.8s para micro cortes de encoding
        if (duration > maxDurationSeconds + 0.8) {
          resolve({
            valid: false,
            isValid: false,
            duration,
            error: `O vídeo selecionado tem ${Math.round(duration)}s. O limite máximo permitido para vídeos curtos é de ${maxDurationSeconds} segundos.`
          });
        } else {
          resolve({
            valid: true,
            isValid: true,
            duration
          });
        }
      };

      video.onerror = () => {
        clearTimeout(timer);
        cleanup();
        // Se for string/URL externa que falhou no preview de metadados, não bloqueia compulsoriamente
        if (typeof fileOrUrl === 'string') {
          resolve({
            valid: true,
            isValid: true,
            duration: 0
          });
        } else {
          resolve({
            valid: false,
            isValid: false,
            duration: 0,
            error: 'Não foi possível ler o formato deste arquivo de vídeo. Verifique se é um arquivo MP4, WebM ou MOV válido.'
          });
        }
      };
    } catch (err) {
      resolve({
        valid: true,
        isValid: true,
        duration: 0
      });
    }
  });
}

/**
 * Converte arquivo em DataURL (Base64) com monitoramento de progresso
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Faz upload de imagem ou vídeo curto para o servidor, salvando no Supabase Storage quando configurado.
 * Retorna a URL pública definitiva ou fallback com segurança.
 */
export async function uploadMediaAssetToServer(
  fileOrDataUrl: File | string,
  fileName?: string
): Promise<{ url: string; source: string; warning?: string }> {
  try {
    let dataUrl: string;
    let name = fileName || 'media_asset';
    let mime = '';

    if (typeof fileOrDataUrl === 'string') {
      dataUrl = fileOrDataUrl;
    } else {
      name = fileOrDataUrl.name;
      mime = fileOrDataUrl.type;
      dataUrl = await readFileAsDataURL(fileOrDataUrl);
    }

    // Se já é uma URL pública http/https de CDN, retorna direta
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return { url: dataUrl, source: 'url' };
    }

    const res = await fetch('/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataUrl,
        filename: name,
        contentType: mime,
      }),
    });

    const data = await res.json();
    if (data.success && data.url) {
      return {
        url: data.url,
        source: data.source || 'supabase_storage',
        warning: data.warning,
      };
    }

    return { url: dataUrl, source: 'local' };
  } catch (err: any) {
    console.warn('Upload via API falhou, utilizando fallback local:', err);
    if (typeof fileOrDataUrl === 'string') return { url: fileOrDataUrl, source: 'local' };
    const local = await readFileAsDataURL(fileOrDataUrl);
    return { url: local, source: 'local' };
  }
}


/**
 * Banco de vídeos arquitetônicos de amostra de até 30s para uso rápido no site
 */
export const ARCHITECTURAL_SAMPLE_VIDEOS = [
  {
    title: 'Tour Residência Contemporânea com Piscina (20s)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-contemporary-villa-with-pool-42517-large.mp4',
    duration: 20
  },
  {
    title: 'Vista Aérea de Casas e Paisagismo (18s)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-modern-houses-and-gardens-41285-large.mp4',
    duration: 18
  },
  {
    title: 'Acompanhamento Técnico no Canteiro de Obras (16s)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-construction-workers-on-a-building-site-41275-large.mp4',
    duration: 16
  },
  {
    title: 'Interiores Integrados Living & Cozinha Gourmet (15s)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-living-room-and-kitchen-41270-large.mp4',
    duration: 15
  }
];
