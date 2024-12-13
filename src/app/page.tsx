import Dropzone from "@/app/components/Dropzone";
import HowToSheet from "@/app/components/HowToSheet";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col mx-auto gap-6 p-16 max-w-lg h-screen">
      <h1 className="text-xl font-bold text-center text-gray-800">
        Exposing Your Gojek Life, One Ride at a Time 🛵 🔍
      </h1>
      <Dropzone />
      <Button>get roasted</Button>
      <HowToSheet />
    </main>
  );
}
