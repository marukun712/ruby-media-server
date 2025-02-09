import PlayButton from "~/components/button/playButton";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Form } from "@remix-run/react";

export function TrackList({
  tracks,
  image,
}: {
  tracks: Track[];
  image: string;
}) {
  return (
    <div className="md:w-1/2 md:mx-auto space-y-6 my-12">
      {tracks.map((track: Track, index: number) => (
        <TrackCard
          key={track.id}
          track={track}
          index={index + 1}
          image={image}
        />
      ))}
    </div>
  );
}

export function TrackCard({
  track,
  index,
  image,
}: {
  track: Track;
  index: number;
  image: string;
}) {
  return (
    <Card className="border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl flex justify-between items-center w-full">
          <div>
            {index}.
            <PlayButton title={track.title} id={track.id} image={image} />
          </div>
          <TrackActions track={track} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export function TrackActions({ track }: { track: Track }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger>
            <DropdownMenuLabel>楽曲を削除する</DropdownMenuLabel>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>楽曲を削除する</DialogTitle>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose>
                <Form method="post" action={`/api/track/delete/${track.id}`}>
                  <Button className="bg-red-500 text-white" type="submit">
                    削除
                  </Button>
                </Form>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
