import React, { useRef, useState, useEffect } from 'react';
import { isVideoMedia } from '../utils/mediaUtils';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Video as VideoIcon, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface MediaViewProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showBadge?: boolean;
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  interactiveControls?: boolean;
  onMediaClick?: () => void;
}

export const MediaView: React.FC<MediaViewProps> = ({
  src,
  alt = 'Mídia Construtora Transformar',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  showBadge = true,
  badgePosition = 'top-left',
  interactiveControls = false,
  onMediaClick
}) => {
  const isVideo = isVideoMedia(src);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsPlaying(autoPlay);
    setIsMuted(muted);
  }, [src, autoPlay, muted]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleRestart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec === Infinity) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBadgePositionClass = () => {
    switch (badgePosition) {
      case 'top-right': return 'top-3 right-3';
      case 'bottom-left': return 'bottom-3 left-3';
      case 'bottom-right': return 'bottom-3 right-3';
      default: return 'top-3 left-3';
    }
  };

  if (!isVideo) {
    return (
      <div className={containerClassName} onClick={onMediaClick}>
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div 
      className={`${containerClassName} group/media`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onMediaClick}
    >
      <video
        ref={videoRef}
        src={src}
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        controls={controls}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Video Indicator Badge */}
      {showBadge && !controls && (
        <div 
          className={`absolute ${getBadgePositionClass()} z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-white text-[10px] font-bold shadow-md tracking-wider pointer-events-none`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <VideoIcon className="w-3 h-3 text-amber-300" />
          <span>VÍDEO 30S</span>
          {duration > 0 && (
            <span className="text-amber-200/90 font-mono">({Math.round(duration)}s)</span>
          )}
        </div>
      )}

      {/* Interactive Overlay Controls for Detailed Views */}
      {interactiveControls && (
        <div 
          className={`absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 flex flex-col gap-2 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Slider */}
          <div className="flex items-center gap-2 text-white text-[11px] font-mono">
            <span className="shrink-0">{formatSeconds(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="shrink-0">{formatSeconds(duration || 30)}</span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-amber-400 hover:text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
                title="Reiniciar vídeo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
                title={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 hidden sm:inline">
                Vídeo Curto • Max 30s
              </span>
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      videoRef.current.requestFullscreen?.();
                    }
                  }
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer text-slate-200"
                title="Tela cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
