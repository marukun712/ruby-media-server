import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "react-player";
import { playerTargetAtom } from "~/state/player";
import { useAtom } from "jotai";
import { useState, useRef } from "react";
import { Pause, Play } from "lucide-react";

export default function Player() {
  const [duration, setDuration] = useState(0);
  const [target] = useAtom(playerTargetAtom);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const [volume, setVolume] = useState(0.1);

  function onDuration(duration: number) {
    setDuration(duration);
  }

  function onSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTime = parseFloat(e.target.value);

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

  function onVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseFloat(e.target.value));
  }

  if (target)
    return (
      <ClientOnly>
        {() => (
          <div className="fixed bottom-0 left-0 right-0 bg-stone-700 py-2 px-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden">
                <ReactPlayer
                  ref={playerRef}
                  url={`http://localhost:4567/stream/${target.id}/playlist.m3u8`}
                  className="react-player"
                  controls={false}
                  playing={playing}
                  onDuration={onDuration}
                  onProgress={onProgress}
                  volume={volume}
                />
              </div>
              <h1 className="mx-12">{target.title}</h1>
              <button
                onClick={onPlayPause}
                className="text-white text-2xl p-2 hover:bg-gray-700 rounded-full"
              >
                {playing ? <Pause /> : <Play />}
              </button>
            </div>
            <div className="flex-grow mx-4">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="any"
                value={currentTime}
                onChange={onSeekChange}
                className="w-full h-1 bg-gray-400 rounded-full cursor-pointer"
              />
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="w-48 h-1 bg-gray-400 rounded-full cursor-pointer"
              />
            </div>
          </div>
        )}
      </ClientOnly>
    );
}
