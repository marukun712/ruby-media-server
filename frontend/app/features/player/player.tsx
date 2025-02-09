import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "react-player";
import { playerTargetAtom } from "~/state/player";
import { useAtom } from "jotai";
import { useState, useRef } from "react";
import { Pause, Play, Repeat, Repeat1, Volume2, VolumeX } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";

export default function Player() {
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);
  const [target] = useAtom(playerTargetAtom);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const [volume, setVolume] = useState(0.1);

  function onDuration(duration: number) {
    setDuration(duration);
  }

  function onSeekChange(value: number[]) {
    const newTime = value[0];
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
      setPlaying(true);
    }
  }

  function onPlayPause() {
    setPlaying((prev) => !prev);
  }

  function onProgress(state: { played: number; playedSeconds: number }) {
    setCurrentTime(state.playedSeconds);
  }

  function onVolumeChange(value: number[]) {
    setVolume(value[0]);
  }

  function toggleMute() {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 0.1 : 0);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (target)
    return (
      <ClientOnly>
        {() => (
          <Card className="fixed bottom-0 left-0 right-0 py-3 px-6 border-t border-stone-700">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-lg shadow-lg"
                  src={target.image}
                  alt={target.title}
                ></img>
                <div className="hidden">
                  <ReactPlayer
                    ref={playerRef}
                    url={`http://localhost:4567/stream/${target.id}/playlist.m3u8`}
                    className="react-player"
                    controls={false}
                    playing={playing}
                    loop={loop}
                    onDuration={onDuration}
                    onProgress={onProgress}
                    volume={volume}
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-medium text-stone-100">
                    {target.title}
                  </h1>
                  <span className="text-sm text-stone-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPlayPause}
                  className="text-stone-100 hover:bg-stone-700 hover:text-stone-50"
                >
                  {playing ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>

                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={onSeekChange}
                    className="cursor-pointer"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLoop(!loop)}
                  className={`text-stone-100 hover:bg-stone-700 hover:text-stone-50 ${
                    loop ? "bg-stone-700" : ""
                  }`}
                >
                  {loop ? (
                    <Repeat1 className="w-5 h-5" />
                  ) : (
                    <Repeat className="w-5 h-5" />
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-stone-100 hover:bg-stone-700 hover:text-stone-50"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <div className="w-24">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={onVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </ClientOnly>
    );
}
