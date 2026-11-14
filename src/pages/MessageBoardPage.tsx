import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Navbar } from "@/components/class/Navbar";
import { ClassFooter } from "@/components/class/ClassFooter";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";

const MessageBoardPage = () => {
  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground">
      <PageMeta title="留言板已被关闭" description="258 班在线留言板已停止服务" />
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-32 pb-16">
        <div className="bg-card handwritten-border shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/20 mx-auto mb-6">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-yang-semibold mb-4">留言板已被关闭</h1>

          <div className="space-y-3 text-muted-foreground font-yang-regular leading-relaxed">
            <p>
              出于维护成本与内容管理的考虑，258 班的在线留言板已经停止服务，不再接受新的留言。
            </p>
            <p>
              感谢大家曾经在这里留下的每一句话。如需联系同学，可以前往班级 QQ 群交流。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline" className="font-yang-regular">
              <Link to="/">返回首页</Link>
            </Button>
            <Button asChild variant="ghost" className="font-yang-regular">
              <Link to="/gallery">前往时光相册</Link>
            </Button>
          </div>
        </div>
      </main>

      <ClassFooter />
    </div>
  );
};

export default MessageBoardPage;
