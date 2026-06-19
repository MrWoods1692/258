import React from "react";

export const ClassFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 border-t border-dashed border-border mt-16 text-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="text-xl font-yang-semibold opacity-60">
          星火三班 · 桂林市奎光学校
        </div>
        <div className="text-sm font-yang-regular text-muted-foreground">
          © 2023 - {currentYear} 258班 · 版权所有
        </div>
        <div className="flex items-center gap-4 mt-4 opacity-30">
          <div className="h-[1px] w-12 bg-foreground" />
          <div className="text-xs uppercase tracking-widest font-yang-regular">
            Stay Hungry, Stay Foolish
          </div>
          <div className="h-[1px] w-12 bg-foreground" />
        </div>
      </div>
    </footer>
  );
};
