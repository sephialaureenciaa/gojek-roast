"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

export default function HowToSheet() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="self-center text-sm text-black opacity-35 underline hover:opacity-50 hover:underline-offset-4"
          variant="link"
        >
          how to get your gojek wrapped
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>how to get your gojek wrapped</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-center items-center py-4">
          <Carousel setApi={setApi} className="w-full max-w-xs">
            <CarouselContent>
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <img
                      src="1.png"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
                <div className="py-2 text-center text-sm ">
                  open your gojek app and go to your profile
                </div>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <img
                      src="2.png"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
                <div className="py-2 text-center text-sm ">
                  go to my activity
                </div>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <img
                      src="3.png"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
                <div className="py-2 text-center text-sm ">
                  click the download icon
                </div>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <img
                      src="4.png"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
                <div className="py-2 text-center text-sm ">
                  set the start date, then click the download button
                </div>
              </CarouselItem>
              <CarouselItem>
                <Card>
                  <CardContent className="flex items-center justify-center p-0">
                    <img
                      src="5.png"
                      className="h-full w-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
                <div className="py-2 text-center text-sm ">and save!</div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Step {current} of {count}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
