import React from "react";
import { Navbar } from "@/components/class/Navbar";
import { ClassFooter } from "@/components/class/ClassFooter";
import { Heart, User, Code, DollarSign } from "lucide-react";

const AboutWebsitePage = () => {
  const techStack = [
    "React 18",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Vite",
    "React Router",
    "next-themes",
  ];

  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-yang-semibold mb-4">关于网站</h1>
          <p className="text-muted-foreground font-yang-regular">
            用代码记录青春，用技术铭刻回忆
          </p>
        </div>

        {/* 创作目的 */}
        <section className="bg-card handwritten-border shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-yang-semibold">创作目的</h2>
          </div>
          <div className="space-y-4 text-muted-foreground font-yang-regular leading-relaxed">
            <p>
              这个网站诞生于 2026 年，是为了给 258 班（星火班）的全体师生创建一个专属的数字空间。
            </p>
            <p>
              在这里，我们记录着从 2023 年 8 月 23 日入学以来的每一个重要时刻——相识的天数、
              班级的荣誉、师生的联系方式、珍贵的照片与视频。
            </p>
            <p>
              希望这个网站能成为我们共同的回忆载体，在多年以后，当我们再次打开它时，
              依然能感受到那份属于 258 班的温暖与骄傲。
            </p>
          </div>
        </section>

        {/* 作者信息 */}
        <section className="bg-card handwritten-border shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-yang-semibold">作者</h2>
          </div>
          <div className="space-y-3 text-muted-foreground font-yang-regular">
            <p>
              <span className="font-yang-semibold text-foreground">开发者：</span>
              258 班学生
            </p>
            <p>
              <span className="font-yang-semibold text-foreground">设计理念：</span>
              手写笔记本风格，灰度配色，纸张纹理，追求简约与怀旧的完美结合
            </p>
            <p>
              <span className="font-yang-semibold text-foreground">开发时间：</span>
              2026 年 4 月
            </p>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="bg-card handwritten-border shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-yang-semibold">技术栈</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-muted/30 border border-border rounded-lg font-yang-regular text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground font-yang-regular">
            采用现代化前端技术栈，纯静态部署，无需后端服务器，所有数据存储于浏览器本地。
          </p>
        </section>

        {/* 投入资金 */}
        <section className="bg-card handwritten-border shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-yang-semibold">投入资金</h2>
          </div>
          <div className="space-y-4 text-muted-foreground font-yang-regular">
            <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
              <span>域名费用</span>
              <span className="font-yang-semibold text-foreground">¥ 95</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
              <span>服务器托管</span>
              <span className="font-yang-semibold text-foreground">¥ 94.05</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
              <span>网盘费用</span>
              <span className="font-yang-semibold text-foreground">¥ 5</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
              <span>开发工具</span>
              <span className="font-yang-semibold text-foreground">$ 1</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
              <span>相机费用</span>
              <span className="font-yang-semibold text-foreground">HK$ 100</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-muted/20 px-4 rounded-lg mt-4">
              <span className="font-yang-semibold text-foreground">总计</span>
              <span className="text-2xl font-yang-semibold text-primary">$ 41</span>
            </div>
            <p className="text-sm mt-4 text-center">
              💡 包含域名、服务器、网盘、开发工具及班级活动拍摄支出（已换算为 USD）
            </p>
          </div>
        </section>

        {/* 致谢 */}
        <div className="mt-12 text-center p-6 bg-muted/10 rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground font-yang-regular leading-relaxed">
            感谢所有为 258 班付出的老师们，感谢每一位同学的陪伴与支持。
            <br />
            愿我们的友谊地久天长，星火班的精神永不熄灭！
          </p>
        </div>
      </main>

      <ClassFooter />
    </div>
  );
};

export default AboutWebsitePage;
