import { Form, useNavigation } from "@remix-run/react";
import { Home, Loader2, Upload } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Player from "~/components/player/player";
import { Input } from "../ui/input";

export default function Main({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  return (
    <div className="flex h-screen">
      <div className="w-64 p-6 flex-col hidden md:flex">
        <a href="/" className="mb-8">
          <h1 className="text-2xl font-bold">Starlight</h1>
        </a>

        <nav className="space-y-4">
          <a
            href="/"
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <Home className="h-5 w-5" />
            <span>ホーム</span>
          </a>
        </nav>

        <div className="mt-auto">
          <Form
            action="/api/upload"
            method="post"
            encType="multipart/form-data"
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm text-gray-400">
                ファイルをアップロード
              </Label>
              <Input id="file" type="file" name="file" />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  アップロード中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4 inline" />
                  アップロード
                </>
              )}
            </Button>
          </Form>
        </div>
      </div>

      <div className="flex-1 md:p-12">{children}</div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Player />
      </div>
    </div>
  );
}
