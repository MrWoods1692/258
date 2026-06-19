import { useState, useEffect } from "react";
import { Navbar } from "@/components/class/Navbar";
import { HeroSection } from "@/components/class/HeroSection";
import { DataCards } from "@/components/class/DataCards";
import { NavigationLinks } from "@/components/class/NavigationLinks";
import { LikeSection } from "@/components/class/LikeSection";
import { ClassFooter } from "@/components/class/ClassFooter";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Quote, Heart, Mail, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const randomQuotes = [
  "星光不问赶路人，时光不负有心人。",
  "少年不惧岁月长，彼方尚有荣光在。",
  "乾坤未定，你我皆是黑马。",
  "半山腰总是最挤的，你得去山顶看看。",
  "且视他人之疑目如盏盏鬼火，大胆去走你的夜路。",
  "鲜衣怒马少年时，不负韶华行且知。",
  "关关难过关关过，前路漫漫亦灿灿。",
  "长风破浪会有时，直挂云帆济沧海。",
  "行而不辍，未来可期。",
  "追风赶月莫停留，平芜尽处是春山。",
  "路虽远，行则将至；事虽难，行则必成。",
  "希君生羽翼，一化北溟鱼。",
  "宝剑锋从磨砺出，梅花香自苦寒来。",
  "书山有路勤为径，学海无涯苦作舟。",
  "业精于勤，荒于嬉；行成于思，毁于随。",
  "天生我材必有用，千金散尽还复来。",
  "大鹏一日同风起，扶摇直上九万里。",
  "千磨万击还坚劲，任尔东西南北风。",
  "山重水复疑无路，柳暗花明又一村。",
  "不畏浮云遮望眼，自缘身在最高层。",
  "恰同学少年，风华正茂；书生意气，挥斥方遒。",
  "天行健，君子以自强不息。",
  "博观而约取，厚积而薄发。",
  "志不立，天下无可成之事。",
  "非淡泊无以明志，非宁静无以致远。",
  "纸上得来终觉浅，绝知此事要躬行。",
  "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
  "青春须早为，岂能长少年。",
  "莫等闲，白了少年头，空悲切。",
  "少年负壮气，奋烈自有时。",
];

const RandomQuoteCard = () => {
  const [quote, setQuote] = useState(randomQuotes[0]);
  const [fadeIn, setFadeIn] = useState(true);

  const getRandomQuote = () => {
    const available = randomQuotes.filter((q) => q !== quote);
    return available[Math.floor(Math.random() * available.length)];
  };

  const handleRefresh = () => {
    setFadeIn(false);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFadeIn(true);
    }, 300);
  };

  useEffect(() => {
    setQuote(randomQuotes[Math.floor(Math.random() * randomQuotes.length)]);
  }, []);

  return (
    <Card className="max-w-2xl mx-auto bg-background/60 shadow-elegant handwritten-border border-border/50">
      <CardContent className="p-6 xl:p-8">
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 xl:w-10 xl:h-10 text-muted-foreground/30 shrink-0 mt-1" />
          <div className="flex-1">
            <p
              className={`text-lg xl:text-xl font-yang-regular italic text-foreground/80 leading-relaxed transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"}`}
            >
              「 {quote} 」
            </p>
            <div className="flex items-center justify-end mt-4 gap-2">
              <span className="text-xs text-muted-foreground/50 font-yang-regular">每日一语</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const letterContent = {
  title: "致 258 班 · 星火三班",
  content: `亲爱的 258 班的同学们：

三年前的初秋，我们相聚在奎光学校，组成了这个温暖的大家庭——星火三班。

一千多个日日夜夜里，我们一起在教室里奋笔疾书，在操场上挥洒汗水，在舞台上绽放光彩。每一次早读的朗朗书声，每一次课间的欢声笑语，每一次考试后的相互鼓励，都化作了青春里最珍贵的回忆。

如今，毕业的钟声即将敲响。愿你们带着星火班的精神，在更广阔的天地里发光发热。

聚是一团火，散是满天星。

祝前程似锦，未来可期！

—— 星火三班全体老师`,
};

const GraduateEnvelope = () => {
  const [animating, setAnimating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    // 动画完成后打开弹窗
    setTimeout(() => {
      setAnimating(false);
      setDialogOpen(true);
    }, 800);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-yang-semibold text-foreground/80 mb-2">🎓 毕业寄语</h3>
          <p className="text-sm text-muted-foreground font-yang-regular">
            点击信封，开启毕业寄语
          </p>
        </div>

        {/* 信封 */}
        <div
          onClick={handleClick}
          className={cn(
            "relative cursor-pointer group",
            animating ? "pointer-events-none" : ""
          )}
        >
          <div
            className={cn(
              "relative w-56 h-40 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 rounded-lg shadow-elegant border-2 border-amber-300 overflow-hidden transition-all duration-700",
              animating
                ? "scale-105 shadow-xl"
                : "group-hover:scale-105 group-hover:shadow-lg"
            )}
          >
            {/* 信封盖（flap）- 上半部三角形 */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 origin-top transition-transform duration-700 z-10",
                animating ? "scale-y-0" : "scale-y-100"
              )}
              style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0)" }}
            />
            
            {/* 信封底部装饰线 */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-200/50 to-transparent" />

            {/* 封口 seal */}
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500",
              animating ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}>
              <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* 打开后露出的内容提示 */}
            <div className={cn(
              "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500",
              animating ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}>
              <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
              <span className="text-sm font-yang-semibold text-amber-700">致 258 班 · 星火三班</span>
              <div className="flex gap-1 mt-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Mail className={cn(
              "w-4 h-4 text-muted-foreground transition-all duration-500",
              animating && "text-amber-500"
            )} />
            <span className="text-sm font-yang-regular text-muted-foreground">
              {animating ? "正在开启..." : "点击打开信封"}
            </span>
          </div>
        </div>

        {/* 弹窗展示信件 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg paper-texture max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-yang-semibold text-xl text-center flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                {letterContent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 font-yang-regular text-foreground/80 leading-relaxed whitespace-pre-line px-2">
              {letterContent.content}
            </div>
            <div className="mt-6 flex justify-center gap-1 pb-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground selection:bg-foreground selection:text-background">
      {/* Notebook binding aesthetic */}
      <div className="fixed top-0 left-4 w-1 h-full border-l-2 border-dashed border-border/40 z-0 pointer-events-none hidden xl:block" />
      <div className="fixed top-0 left-8 w-1 h-full border-l border-border/20 z-0 pointer-events-none hidden xl:block" />

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto">
          <HeroSection />

          {/* 随机语录卡片 */}
          <div className="my-12 px-4">
            <RandomQuoteCard />
          </div>
          
          {/* 毕业寄语信封 */}
          <GraduateEnvelope />
          
          <div className="my-16 flex justify-center opacity-20">
            <div className="h-[2px] w-32 bg-foreground rounded-full" />
          </div>
          
          <DataCards />
          
          <div className="my-16 flex justify-center opacity-20">
            <div className="h-[2px] w-32 bg-foreground rounded-full rotate-2" />
          </div>
          
          <NavigationLinks />
          
          <div className="my-16 flex justify-center opacity-20">
            <div className="h-[2px] w-32 bg-foreground rounded-full -rotate-2" />
          </div>
          
          <LikeSection />
        </main>
        
        <ClassFooter />
      </div>

      {/* Additional Paper Aesthetics */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-[999]" />
    </div>
  );
};

export default HomePage;
