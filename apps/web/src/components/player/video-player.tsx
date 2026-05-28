'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  Settings,
  Subtitles,
  PictureInPicture2,
} from 'lucide-react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  onProgress?: (progress: number, duration: number) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  startTime?: number;
}

export function VideoPlayer({
  src,
  title,
  poster,
  onProgress,
  onEnded,
  autoPlay = false,
  startTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play();
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      if (autoPlay) video.play();
    } else {
      video.src = src;
      if (autoPlay) video.play();
    }
  }, [src, autoPlay]);

  useEffect(() => {
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
    }
  }, [startTime]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setFullscreen(false);
    } else {
      await container.requestFullscreen();
      setFullscreen(true);
    }
  }, []);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
    onProgress?.(video.currentTime, video.duration);
  }, [onProgress]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const video = videoRef.current;
      const bar = progressRef.current;
      if (!video || !bar) return;
      const rect = bar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * duration;
    },
    [duration],
  );

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const skip = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + seconds));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, skip]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={onEnded}
        onVolumeChange={() => {
          if (videoRef.current) setVolume(videoRef.current.volume);
        }}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top gradient */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/70 to-transparent" />

        {/* Title */}
        {title && (
          <div className="absolute top-4 left-4 text-sm font-medium">{title}</div>
        )}

        {/* Center play button */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="p-5 bg-primary/80 hover:bg-primary rounded-full transition-all"
            >
              <Play className="w-8 h-8 fill-white text-white" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white/30 rounded-full absolute"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
            <div
              className="h-full bg-primary rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>
              <button onClick={() => skip(10)} className="hover:text-primary transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {muted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <span className="text-xs text-white/70">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="hover:text-primary transition-colors">
                <Subtitles className="w-5 h-5" />
              </button>
              <button className="hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={togglePip} className="hover:text-primary transition-colors">
                <PictureInPicture2 className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-primary transition-colors">
                {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
