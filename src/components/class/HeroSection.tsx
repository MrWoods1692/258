import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const mottos = [
  "星火三班，奋勇争先，挑战极限，勇夺桂冠",
  "效皇五帝逐群雄，成八斗奇才傲天下",
  "258班，起早贪黑，全力以赴，勇夺桂冠",
];

export const HeroSection = () => {
  const [index, setIndex] = useLocalStorage("current-motto-index", 0);
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const nextMotto = () => {
    setIndex((prev) => (prev + 1) % mottos.length);
  };

  const prevMotto = () => {
    setIndex((prev) => (prev - 1 + mottos.length) % mottos.length);
  };

  // 自动轮播
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % mottos.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [setIndex]);

  return (
    <section className="pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center relative">
      <div className="flex items-center gap-6 mb-8 animate-fade-in-down">
        <div className="w-20 h-20 xl:w-28 xl:h-28 [perspective:200px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
          <div className={cn("relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]", flipped && "[transform:rotateY(180deg)]")}>
            {/* 校徽 - 正面 */}
            <div className="absolute inset-0 rounded-full bg-white shadow-elegant p-1 border-2 border-border overflow-hidden [backface-visibility:hidden]">
              <img
                src="https://cloudflarecnimg.scdn.io/i/6a34e75125111_1781851985.png"
                alt="桂林市奎光学校校徽"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            {/* 翻转后图片 - 背面 */}
            <div className="absolute inset-0 rounded-full bg-white shadow-elegant p-1 border-2 border-border overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <img
                src="https://cloudflarecnimg.scdn.io/i/6a34e7780fcfa_1781852024.png"
                alt="翻转图片"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="w-20 h-20 xl:w-28 xl:h-28 rounded-full bg-white shadow-elegant p-1 border-2 border-border overflow-hidden">
          <img
            src="https://cloudflarecnimg.scdn.io/i/6a34e71ead2d2_1781851934.jpg"
            alt="星火班班徽"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      <div className="mb-10 animate-fade-in-up stagger-1">
        <h2 className="text-xl xl:text-2xl font-yang-regular text-muted-foreground mb-1">
          桂林市奎光学校
        </h2>
        <h1 className="text-4xl xl:text-5xl font-yang-semibold text-foreground tracking-tight">
          258班 · 星火班
        </h1>
      </div>

      <div className="max-w-xl w-full mx-auto relative group animate-fade-in-up stagger-2">
        <div className="relative h-24 flex items-center justify-center px-12 overflow-hidden bg-muted/30 handwritten-border p-4 shadow-sm">
          {mottos.map((motto, i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 flex items-center justify-center p-8 transition-all duration-700 text-lg xl:text-xl font-yang-regular",
                index === i
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              )}
            >
              「 {motto} 」
            </div>
          ))}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMotto}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMotto}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {mottos.map((_, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full cursor-pointer transition-all",
                index === i ? "bg-foreground scale-125" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-12 animate-fade-in-up stagger-3">
        <div className="text-6xl xl:text-8xl font-yang-semibold opacity-20 select-none text-foreground/40">
          258
        </div>
        <div className="mt-[-2.5rem] xl:mt-[-3.5rem] font-yang-semibold text-2xl xl:text-3xl bg-background px-4 inline-block border-2 border-border rounded-lg">
          班号
        </div>
      </div>
    </section>
  );
};
