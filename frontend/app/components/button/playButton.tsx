import { Play } from "lucide-react";
import { useSetPlayerTarget } from "~/state/player";

export default function PlayButton({
  title,
  id,
  image,
}: {
  title: string;
  id: string;
  image: string;
}) {
  const setPlayerTarget = useSetPlayerTarget();

  return (
    <button onClick={() => setPlayerTarget({ title, id, image })}>
      <div className="flex items-center">
        <Play className="mx-4" />
        {title}
      </div>
    </button>
  );
}
