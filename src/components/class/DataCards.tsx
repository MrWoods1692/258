import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDaysCalculator } from "@/hooks/useDaysCalculator";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

const StatCard = ({
  label,
  value,
  suffix = "",
  index = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  index?: number;
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const count = useCountUp({ end: value, duration: 2000, enabled: isVisible });

  return (
    <div ref={ref}>
      <Card
        className={cn(
          "bg-background/80 paper-texture shadow-elegant overflow-hidden handwritten-border p-4 text-center transition-all duration-700 hover:scale-105 opacity-100",
          isVisible ? "translate-y-0" : "translate-y-0"
        )}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-4 pt-6">
          <div className="text-3xl xl:text-4xl font-yang-semibold text-foreground mb-1">
            {count}
            <span className="text-base ml-1">{suffix}</span>
          </div>
          <div className="text-sm xl:text-base font-yang-regular text-muted-foreground whitespace-nowrap">
            {label}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const DataCards = () => {
  const days = useDaysCalculator("2023-08-23", "2026-06-27");

  const cards = [
    { label: "相识天数", value: days.sinceStart, suffix: "天" },
    { label: "入学时间", value: 2023, suffix: "年" }, // 无法直接显示日期在CountUp，所以显示年份或特定值
    { label: "毕业时间", value: 2026, suffix: "年" },
    { label: "班级学生人数", value: 53, suffix: "人" },
    { label: "班级教师人数", value: 20, suffix: "人" },
    {
      label: days.isAfterEnd ? "已毕业天数" : "距毕业还有",
      value: days.isAfterEnd ? days.afterEndDays : days.untilEnd,
      suffix: "天",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <StatCard key={card.label} {...card} index={i} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-4 text-muted-foreground font-yang-regular text-sm border-t border-dashed border-border pt-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-border" />
          入学：2023年8月23日
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-border" />
          毕业：2026年6月27日
        </div>
      </div>
    </section>
  );
};
