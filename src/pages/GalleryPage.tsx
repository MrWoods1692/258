import React, { useState } from "react";
import { Navbar } from "@/components/class/Navbar";
import { ClassFooter } from "@/components/class/ClassFooter";
import { Image, Video, HardDrive, ExternalLink, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GalleryStats {
  photoCount: number;
  videoCount: number;
  totalSizeGB: number;
}

interface StorageLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

const stats: GalleryStats = {
  photoCount: 2480,
  videoCount: 1986,
  totalSizeGB: 116.1,
};

const storageLinks: StorageLink[] = [
  {
    name: "Alist 路线",
    url: "https://alist.mrcwoods.com/",
    icon: <HardDrive className="w-5 h-5" />,
    description: "网站管理员掏钱买了台香港2C2G的机子，安装了一个Alist作为在线浏览平台，里面集合了各个平台存储的媒体文件。但是带宽10兆，多人加载会比较慢。",
  },
  {
    name: "NAS 路线",
    url: "https://share.fnnas.net/s/2b0358c7a89b433890",
    icon: <HardDrive className="w-5 h-5" />,
    description: "管理员的NAS，里面有全部照片，外网网速受到限制。",
  },
  {
    name: "夸克网盘路线",
    url: "https://pan.quark.cn/s/bf3174b4fa3b",
    icon: <ExternalLink className="w-5 h-5" />,
    description: "里面内容全面，需要夸克网盘账号。",
  },
  {
    name: "一刻相册路线",
    url: "https://photo.baidu.com/photo/wap/albumShare/invite/ZKEDIJzjjt?from=webcreate",
    icon: <ExternalLink className="w-5 h-5" />,
    description: "里面只有部分内容，需要一刻相册（百度）账号。",
  },
  {
    name: "蓝奏云优享版路线",
    url: "https://www.ilanzou.com/s/QIMXcbuh",
    icon: <HardDrive className="w-5 h-5" />,
    description: "里面只有部分内容，需要蓝奏云优享版账号。",
  },
];

const CopyLink = ({ link }: { link: StorageLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-all group relative">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 flex-1"
      >
        <div className="text-primary">{link.icon}</div>
        <span className="font-yang-semibold">{link.name}</span>
      </a>
      <div className="flex items-center gap-0.5">
        {/* 说明按钮 */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
              title="查看说明"
            >
              <Info className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md paper-texture">
            <DialogHeader>
              <DialogTitle className="font-yang-semibold text-xl flex items-center gap-2">
                {link.icon}
                {link.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 font-yang-regular text-muted-foreground leading-relaxed">
              <p>{link.description}</p>
              <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-dashed border-border">
                <p className="text-xs text-muted-foreground break-all">
                  <span className="font-yang-semibold text-foreground">链接地址：</span>
                  {link.url}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 复制按钮 */}
        <button
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-300",
            copied
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 scale-105"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          onClick={handleCopy}
          title="复制链接"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>

        {/* 打开链接 */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="在新标签页中打开"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-yang-semibold mb-4">时光相册</h1>
          <p className="text-muted-foreground font-yang-regular">
            记录 258 班的每一个精彩瞬间
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card handwritten-border shadow-sm p-8 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-yang-semibold mb-2">{stats.photoCount}</div>
            <div className="text-sm text-muted-foreground font-yang-regular">照片数量</div>
          </div>

          <div className="bg-card handwritten-border shadow-sm p-8 text-center">
            <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-yang-semibold mb-2">{stats.videoCount}</div>
            <div className="text-sm text-muted-foreground font-yang-regular">视频数量</div>
          </div>

          <div className="bg-card handwritten-border shadow-sm p-8 text-center">
            <HardDrive className="w-12 h-12 mx-auto mb-4 text-primary" />
            <div className="text-4xl font-yang-semibold mb-2">{stats.totalSizeGB} GB</div>
            <div className="text-sm text-muted-foreground font-yang-regular">总大小</div>
          </div>
        </div>

        {/* 访问路线 */}
        <div className="bg-card handwritten-border shadow-sm p-8">
          <h2 className="text-2xl font-yang-semibold mb-6 text-center">访问路线</h2>
          <div className="space-y-4">
            {storageLinks.map((link, index) => (
              <CopyLink key={index} link={link} />
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground font-yang-regular text-center">
              💡 提示：建议使用 Alist 路线获得最佳浏览体验
            </p>
          </div>
        </div>

        {/* 说明文字 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground font-yang-regular leading-relaxed">
            相册内容包含班级活动、课堂瞬间、运动会、文艺演出等珍贵回忆
            <br />
            所有内容仅供班级内部访问，请勿外传
          </p>
        </div>
      </main>

      <ClassFooter />
    </div>
  );
};

export default GalleryPage;
