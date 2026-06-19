import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "首页", href: "/" },
    { name: "时光相册", href: "/gallery" },
    { name: "班级成员", href: "/members" },
    { name: "关于网站", href: "/about-website" },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <>
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-4 py-3",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-elegant rounded-xl border border-border/30 mx-auto mt-2 inset-x-0 max-w-3xl w-[calc(100%-1rem)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-yang-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
          <img
            src="https://cloudflarecnimg.scdn.io/i/6a34e71ead2d2_1781851934.jpg"
            alt="班徽"
            className="w-8 h-8 xl:w-9 xl:h-9 rounded-full object-contain bg-white border border-border/30"
          />
          星火班
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">切换主题</span>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-md">
                <Menu className="h-6 w-6" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background paper-texture border-l-2 border-border">
              <SheetHeader>
                <SheetTitle className="font-yang-semibold text-xl border-b pb-2">菜单导航</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleLinkClick}
                    className="text-lg font-yang-regular py-2 border-b border-border/50 hover:pl-2 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
      <BackToTop />
    </>
  );
};

const BackToTop = () => {
  const progressRef = useRef(0);
  const circleRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      progressRef.current = scrollProgress;
      setVisible(scrollTop > 300);

      if (circleRef.current) {
        const offset = circumference - scrollProgress * circumference;
        circleRef.current.setAttribute("stroke-dashoffset", String(offset));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [circumference]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-background/80 backdrop-blur-md shadow-elegant border border-border/50 transition-all duration-500 hover:scale-110",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="返回顶部"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="25%" stopColor="#feca57" />
            <stop offset="50%" stopColor="#48dbfb" />
            <stop offset="75%" stopColor="#ff9ff3" />
            <stop offset="100%" stopColor="#54a0ff" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" opacity="0.5" />
        <circle
          ref={circleRef}
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
        />
      </svg>
      <ArrowUp className="w-5 h-5 text-foreground relative z-10" />
    </button>
  );
};
