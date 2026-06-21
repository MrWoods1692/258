import React, { useState } from "react";
import { Image, Users, MessageCircle, Copy, Check, StickyNote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const qqGroups = [
  {
    name: "KG2023级258班学生群（星火班）",
    number: "668413365",
    link: null,
  },
  {
    name: "258语文学习群",
    number: "709633741",
    link: "https://qm.qq.com/q/pOUhAmjfJm",
  },
  {
    name: "奎光23级258班",
    number: "153508737",
    link: "https://qm.qq.com/q/JAGEwafhGG",
  },
];

const QQGroupCard = ({ group }: { group: typeof qqGroups[0] }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(group.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-dashed border-border last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-yang-semibold text-base mb-2">{group.name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-yang-regular">
            <span>群号：</span>
            <span className="font-mono">{group.number}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        {group.link && (
          <a
            href={group.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button size="sm" variant="outline" className="font-yang-regular">
              加入群聊
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

const links = [
  { icon: Users, name: "班级成员", href: "/members", type: "link" },
  { icon: Image, name: "时光相册", href: "/gallery", type: "link" },
  { icon: StickyNote, name: "留言板", href: import.meta.env.VITE_MESSAGE_BOARD_URL || "https://b.258.mrcwoods.com/", type: "external" },
  { icon: MessageCircle, name: "QQ群", type: "dialog" },
];

export const NavigationLinks = () => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h3 className="text-2xl font-yang-semibold text-center mb-10 opacity-60">
        功能导航区
      </h3>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {links.map((link) => {
          if (link.type === "dialog") {
            return (
              <Dialog key={link.name}>
                <DialogTrigger asChild>
                  <div className="group block cursor-pointer">
                    <Card className="handwritten-border shadow-sm hover:shadow-elegant transition-all duration-300 p-6 flex flex-col items-center gap-4 bg-background">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/20 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all">
                        <link.icon className="w-8 h-8" />
                      </div>
                      <span className="font-yang-semibold text-lg">{link.name}</span>
                    </Card>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-md paper-texture">
                  <DialogHeader>
                    <DialogTitle className="font-yang-semibold text-xl flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      班级QQ群
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {qqGroups.map((group) => (
                      <QQGroupCard key={group.number} group={group} />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            );
          }

          if (link.type === "external") {
            return (
              <a
                key={link.name}
                href={link.href || "#"}
                className="group block"
              >
                <Card className="handwritten-border shadow-sm hover:shadow-elegant transition-all duration-300 p-6 flex flex-col items-center gap-4 bg-background">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/20 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all">
                    <link.icon className="w-8 h-8" />
                  </div>
                  <span className="font-yang-semibold text-lg">{link.name}</span>
                </Card>
              </a>
            );
          }

          return (
            <Link
              key={link.name}
              to={link.href || "#"}
              className="group block"
            >
              <Card className="handwritten-border shadow-sm hover:shadow-elegant transition-all duration-300 p-6 flex flex-col items-center gap-4 bg-background">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/20 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all">
                  <link.icon className="w-8 h-8" />
                </div>
                <span className="font-yang-semibold text-lg">{link.name}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
