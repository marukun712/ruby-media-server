import { ClientOnly } from "remix-utils/client-only";
import ReactPlayer from "react-player";
import { Play } from "lucide-react";

export default function Player() {
  return (
    <ClientOnly>
      {() => (
        <div className="aspect-video rounded-lg overflow-hidden">
          <ReactPlayer
            url="http://localhost:4567/stream/106a7e9b-f40b-46ac-ab28-a5c3342e9064/playlist.m3u8"
            className="react-player"
            controls={true}
            width="100%"
            height="100%"
            playing={false}
            light={true}
            playIcon={<Play className="text-white" size={64} />}
          />
        </div>
      )}
    </ClientOnly>
  );
}
