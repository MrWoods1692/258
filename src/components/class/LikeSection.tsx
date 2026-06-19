import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

interface HeartPos {
  id: number;
  x: number;
}

export const LikeSection = () => {
  const [likes, setLikes] = useLocalStorage("total-likes", 0);
  const [hearts, setHearts] = useState<HeartPos[]>([]);
  const [isPumping, setIsPumping] = useState(false);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    setIsPumping(true);
    setTimeout(() => setIsPumping(false), 200);

    const newHeart: HeartPos = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10% to 90%
    };
    setHearts((prev) => [...prev, newHeart]);

    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <section className="py-24 px-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute animate-heart-fall text-destructive"
            style={{
              left: `${heart.x}%`,
              top: "-40px",
            }}
          >
            <Heart className="fill-current w-8 h-8 opacity-60" />
          </div>
        ))}
      </div>

      <div className="text-center z-10">
        <h3 className="text-xl xl:text-2xl font-yang-semibold mb-6 text-muted-foreground">
          点赞区 · 爱在 258 班
        </h3>
        
        <div className="relative inline-block mb-4">
          <Button
            size="lg"
            variant="ghost"
            onClick={handleLike}
            className={cn(
              "w-24 h-24 rounded-full border-4 border-foreground hover:bg-foreground hover:text-background transition-all p-0",
              isPumping && "scale-110"
            )}
          >
            <Heart className={cn("w-12 h-12", likes > 0 && "fill-current")} />
          </Button>
          
          <div className="absolute -top-4 -right-4 bg-foreground text-background text-sm font-bold px-3 py-1 rounded-full shadow-lg min-w-[3rem]">
            {likes}
          </div>
        </div>
        
        <p className="font-yang-regular text-muted-foreground mt-4 italic">
          点一下赞，留一份心
        </p>
      </div>

      <style>{`
        @keyframes heart-fall {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) scale(0.5) rotate(45deg);
            opacity: 0;
          }
        }
        .animate-heart-fall {
          animation: heart-fall 2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};
