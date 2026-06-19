import React, { useState } from "react";
import { Navbar } from "@/components/class/Navbar";
import { ClassFooter } from "@/components/class/ClassFooter";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Copy, Check, Phone, MessageSquare, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Student {
  id: number;
  name: string;
  photo: string;
  gender: "男" | "女";
  studentId: string;
  positions: string[];
  phone?: string;
  qqNumber?: string;
  wechat?: string;
}

interface Teacher {
  id: number;
  name: string;
  avatar: string;
  gender: "男" | "女";
  subject: string;
  isClassTeacher?: boolean;
  phone?: string;
  qqNumber?: string;
  wechat?: string;
}

// 示例学生数据
const students: Student[] = [
  {
    id: 1,
    name: "张三",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang",
    gender: "男",
    studentId: "2023001",
    positions: ["班长", "数学课代表"],
    phone: "13800138000",
    qqNumber: "1234567890",
    wechat: "zhangsan_wx",
  },
  {
    id: 2,
    name: "李四",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Li",
    gender: "女",
    studentId: "2023002",
    positions: ["学习委员"],
    phone: "13900139000",
    qqNumber: "2345678901",
    wechat: "lisi_wx",
  },
  {
    id: 3,
    name: "王五",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang",
    gender: "男",
    studentId: "2023003",
    positions: ["体育委员"],
    phone: "13700137000",
    qqNumber: "3456789012",
    wechat: "wangwu_wx",
  },
  {
    id: 4,
    name: "赵六",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao",
    gender: "女",
    studentId: "2023004",
    positions: ["文艺委员", "英语课代表"],
    phone: "13600136000",
    qqNumber: "4567890123",
    wechat: "zhaoliu_wx",
  },
  {
    id: 5,
    name: "孙七",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sun",
    gender: "男",
    studentId: "2023005",
    positions: [],
    phone: "13500135000",
    qqNumber: "5678901234",
    wechat: "sunqi_wx",
  },
  {
    id: 6,
    name: "周八",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhou",
    gender: "女",
    studentId: "2023006",
    positions: ["生活委员"],
    phone: "13400134000",
    qqNumber: "6789012345",
    wechat: "zhouba_wx",
  },
];

// 示例教师数据
const teachers: Teacher[] = [
  {
    id: 1,
    name: "陈老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen",
    gender: "女",
    subject: "语文",
    isClassTeacher: true,
    phone: "13800001001",
    qqNumber: "1111111111",
    wechat: "chen_teacher",
  },
  {
    id: 2,
    name: "刘老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liu",
    gender: "男",
    subject: "数学",
    phone: "13800001002",
    qqNumber: "2222222222",
    wechat: "liu_teacher",
  },
  {
    id: 3,
    name: "杨老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yang",
    gender: "女",
    subject: "英语",
    phone: "13800001003",
    qqNumber: "3333333333",
    wechat: "yang_teacher",
  },
  {
    id: 4,
    name: "黄老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huang",
    gender: "男",
    subject: "物理",
    phone: "13800001004",
    qqNumber: "4444444444",
    wechat: "huang_teacher",
  },
  {
    id: 5,
    name: "吴老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wu",
    gender: "女",
    subject: "化学",
    phone: "13800001005",
    qqNumber: "5555555555",
    wechat: "wu_teacher",
  },
  {
    id: 6,
    name: "郑老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zheng",
    gender: "男",
    subject: "体育",
    phone: "13800001006",
    qqNumber: "6666666666",
    wechat: "zheng_teacher",
  },
];

const ContactRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors group text-left"
      title={`点击复制 ${label}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{icon}</span>
        <div>
          <p className="text-xs text-muted-foreground/60">{label}</p>
          <p className="text-sm font-yang-regular text-foreground">{value}</p>
        </div>
      </div>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
      )}
    </button>
  );
};

const StudentCard = ({ student }: { student: Student }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-card handwritten-border shadow-sm hover:shadow-elegant transition-all p-6 flex flex-col items-center text-center cursor-pointer"
      >
        <img
          src={student.photo}
          alt={student.name}
          className="w-24 h-24 rounded-full border-2 border-border mb-4"
        />
        <h3 className="text-lg font-yang-semibold mb-2">{student.name}</h3>
        <div className="space-y-1 text-sm text-muted-foreground font-yang-regular">
          <p>性别：{student.gender}</p>
          <p>学号：{student.studentId}</p>
          {student.positions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {student.positions.map((pos, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                >
                  {pos}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm paper-texture">
          <DialogHeader>
            <DialogTitle className="font-yang-semibold text-xl flex items-center gap-3">
              <img
                src={student.photo}
                alt={student.name}
                className="w-10 h-10 rounded-full border border-border"
              />
              {student.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-1">
            <ContactRow icon={<Phone className="w-4 h-4" />} label="手机号" value={student.phone || "未填写"} />
            <ContactRow icon={<MessageSquare className="w-4 h-4" />} label="QQ号" value={student.qqNumber || "未填写"} />
            <ContactRow icon={<User className="w-4 h-4" />} label="微信号" value={student.wechat || "未填写"} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-card handwritten-border shadow-sm hover:shadow-elegant transition-all p-6 flex flex-col items-center text-center relative cursor-pointer"
      >
        {teacher.isClassTeacher && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-md font-yang-semibold">
            班主任
          </div>
        )}
        <img
          src={teacher.avatar}
          alt={teacher.name}
          className="w-24 h-24 rounded-full border-2 border-border mb-4"
        />
        <h3 className="text-lg font-yang-semibold mb-2">{teacher.name}</h3>
        <div className="space-y-1 text-sm text-muted-foreground font-yang-regular">
          <p>性别：{teacher.gender}</p>
          <p>科目：{teacher.subject}</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm paper-texture">
          <DialogHeader>
            <DialogTitle className="font-yang-semibold text-xl flex items-center gap-3">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-10 h-10 rounded-full border border-border"
              />
              {teacher.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-1">
            <ContactRow icon={<Phone className="w-4 h-4" />} label="手机号" value={teacher.phone || "未填写"} />
            <ContactRow icon={<MessageSquare className="w-4 h-4" />} label="QQ号" value={teacher.qqNumber || "未填写"} />
            <ContactRow icon={<User className="w-4 h-4" />} label="微信号" value={teacher.wechat || "未填写"} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MembersPage = () => {
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.studentId.includes(q) ||
      s.positions.some((p) => p.toLowerCase().includes(q))
    );
  });

  const filteredTeachers = teachers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    );
  });

  const currentList = activeTab === "students" ? filteredStudents : filteredTeachers;

  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-yang-semibold mb-4">班级成员</h1>
          <p className="text-muted-foreground font-yang-regular">
            258班 · 星火班全体师生
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索姓名、学号、职位..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-border bg-background font-yang-regular text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted/50 transition-colors"
                title="清除搜索"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* 切换胶囊 */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-muted/30 p-1 rounded-full handwritten-border">
            <button
              onClick={() => setActiveTab("students")}
              className={cn(
                "px-8 py-3 rounded-full font-yang-semibold transition-all flex items-center gap-2",
                activeTab === "students"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="w-4 h-4" />
              学生
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={cn(
                "px-8 py-3 rounded-full font-yang-semibold transition-all flex items-center gap-2",
                activeTab === "teachers"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              老师
            </button>
          </div>
        </div>

        {/* 内容区 */}
        {currentList.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeTab === "students"
                ? filteredStudents.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))
                : filteredTeachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                  ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground font-yang-regular">
                共 {currentList.length} 位{activeTab === "students" ? "学生" : "老师"}{searchQuery ? "（已筛选）" : ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-yang-regular text-muted-foreground">
              未找到匹配的{activeTab === "students" ? "学生" : "老师"}
            </p>
            <p className="text-sm font-yang-regular text-muted-foreground/60 mt-1">
              试试其他关键词
            </p>
          </div>
        )}
      </main>

      <ClassFooter />
    </div>
  );
};

export default MembersPage;
