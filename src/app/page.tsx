import Button from "@/components/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main className="xl:items-center justify-center max-w-3xl xl:max-w-full flex flex-col gap-6 xl:text-center px-10 md:px-16 mt-30 md:mt-56">
        <h1 className="font-lora text-5xl md:text-7xl leading-14 md:leading-20">
          Stories, Without the Noise
        </h1>
        <p className="font-inter font-extralight text-lg xl:text-md">
          Sharing AI translated daily reads with the community.
        </p>
      </main>
      <p className="font-inter text-sm font-extralight bottom-4 absolute right-4">
        ~ an inititaive by antrax
      </p>
      <div className="flex gap-4 md:gap-10 xl:justify-center mt-10 px-10 md:px-16">
        <Button btnType="block" href="/novels" className="block md:hidden">
          Browse
        </Button>
        <Button btnType="block" href="/signup">
          Sign Up
        </Button>
      </div>
    </div>
  );
}
