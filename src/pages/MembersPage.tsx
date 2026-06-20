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

// 学生数据
const students: Student[] = [
  { id: 258001, name: "曾君涵", photo: "https://q1.qlogo.cn/g?b=qq&nk=2897180560&s=100", gender: "男", studentId: "258001", positions: [], phone: "", qqNumber: "2897180560", wechat: "未知" },
  { id: 258002, name: "常芮涵", photo: "https://q1.qlogo.cn/g?b=qq&nk=3662115535&s=100", gender: "女", studentId: "258002", positions: ["副班长", "语文课代表"], phone: "", qqNumber: "3662115535", wechat: "未知" },
  { id: 258003, name: "陈森林", photo: "https://q1.qlogo.cn/g?b=qq&nk=1692138502&s=100", gender: "男", studentId: "258003", positions: ["信息课代表", "电教委员"], phone: "", qqNumber: "1692138502", wechat: "未知" },
  { id: 258004, name: "郭梓翰", photo: "https://q1.qlogo.cn/g?b=qq&nk=3640395948&s=100", gender: "男", studentId: "258004", positions: ["数学课代表"], phone: "", qqNumber: "3640395948", wechat: "未知" },
  { id: 258005, name: "黄富耀", photo: "https://q1.qlogo.cn/g?b=qq&nk=2945397792&s=100", gender: "男", studentId: "258005", positions: ["体育委员"], phone: "", qqNumber: "2945397792", wechat: "未知" },
  { id: 258006, name: "蒋炎彬", photo: "https://q1.qlogo.cn/g?b=qq&nk=1474098028&s=100", gender: "男", studentId: "258006", positions: [], phone: "", qqNumber: "1474098028", wechat: "未知" },
  { id: 258007, name: "李皓阳", photo: "https://q1.qlogo.cn/g?b=qq&nk=952695320&s=100", gender: "男", studentId: "258007", positions: [], phone: "", qqNumber: "952695320", wechat: "未知" },
  { id: 258008, name: "李加佳", photo: "https://q1.qlogo.cn/g?b=qq&nk=3504884267&s=100", gender: "男", studentId: "258008", positions: ["数学课代表"], phone: "", qqNumber: "3504884267", wechat: "未知" },
  { id: 258009, name: "李俊熹", photo: "https://q1.qlogo.cn/g?b=qq&nk=1461877264&s=100", gender: "男", studentId: "258009", positions: [], phone: "", qqNumber: "1461877264", wechat: "未知" },
  { id: 258010, name: "李善楷", photo: "https://q1.qlogo.cn/g?b=qq&nk=234611763&s=100", gender: "男", studentId: "258010", positions: ["语文组长"], phone: "", qqNumber: "234611763", wechat: "未知" },
  { id: 258011, name: "李彤宇", photo: "https://q1.qlogo.cn/g?b=qq&nk=3662322706&s=100", gender: "男", studentId: "258011", positions: [], phone: "", qqNumber: "3662322706", wechat: "未知" },
  { id: 258012, name: "李振宇", photo: "https://q1.qlogo.cn/g?b=qq&nk=1312076999&s=100", gender: "男", studentId: "258012", positions: [], phone: "", qqNumber: "1312076999", wechat: "未知" },
  { id: 258013, name: "廖力衡", photo: "https://q1.qlogo.cn/g?b=qq&nk=1786829995&s=100", gender: "男", studentId: "258013", positions: [], phone: "", qqNumber: "1786829995", wechat: "未知" },
  { id: 258014, name: "廖禹钧", photo: "https://q1.qlogo.cn/g?b=qq&nk=2558787083&s=100", gender: "男", studentId: "258014", positions: [], phone: "", qqNumber: "2558787083", wechat: "未知" },
  { id: 258015, name: "林继烨", photo: "https://q1.qlogo.cn/g?b=qq&nk=3807950084&s=100", gender: "男", studentId: "258015", positions: [], phone: "", qqNumber: "3807950084", wechat: "未知" },
  { id: 258016, name: "刘嘉明", photo: "https://q1.qlogo.cn/g?b=qq&nk=3038138931&s=100", gender: "男", studentId: "258016", positions: [], phone: "", qqNumber: "3038138931", wechat: "未知" },
  { id: 258017, name: "毛福涛", photo: "https://q1.qlogo.cn/g?b=qq&nk=2420558228&s=100", gender: "男", studentId: "258017", positions: [], phone: "", qqNumber: "2420558228", wechat: "未知" },
  { id: 258018, name: "莫智森", photo: "https://q1.qlogo.cn/g?b=qq&nk=3651239985&s=100", gender: "男", studentId: "258018", positions: [], phone: "", qqNumber: "3651239985", wechat: "未知" },
  { id: 258019, name: "施奕宏", photo: "https://q1.qlogo.cn/g?b=qq&nk=2935185929&s=100", gender: "男", studentId: "258019", positions: [], phone: "", qqNumber: "2935185929", wechat: "未知" },
  { id: 258020, name: "苏祉畅", photo: "https://q1.qlogo.cn/g?b=qq&nk=1720533352&s=100", gender: "男", studentId: "258020", positions: [], phone: "", qqNumber: "1720533352", wechat: "未知" },
  { id: 258021, name: "唐俊鑫", photo: "https://q1.qlogo.cn/g?b=qq&nk=3659519535&s=100", gender: "男", studentId: "258021", positions: [], phone: "", qqNumber: "3659519535", wechat: "未知" },
  { id: 258022, name: "田烨霖", photo: "https://q1.qlogo.cn/g?b=qq&nk=8680458&s=100", gender: "男", studentId: "258022", positions: [], phone: "", qqNumber: "8680458", wechat: "未知" },
  { id: 258023, name: "肖何仁杰", photo: "https://q1.qlogo.cn/g?b=qq&nk=1728171096&s=100", gender: "男", studentId: "258023", positions: [], phone: "", qqNumber: "1728171096", wechat: "未知" },
  { id: 258024, name: "熊杰", photo: "https://q1.qlogo.cn/g?b=qq&nk=3489722469&s=100", gender: "男", studentId: "258024", positions: [], phone: "", qqNumber: "3489722469", wechat: "未知" },
  { id: 258025, name: "薛雅云", photo: "https://q1.qlogo.cn/g?b=qq&nk=2137855854&s=100", gender: "男", studentId: "258025", positions: [], phone: "", qqNumber: "2137855854", wechat: "未知" },
  { id: 258026, name: "张恒瑞", photo: "https://q1.qlogo.cn/g?b=qq&nk=1165175122&s=100", gender: "男", studentId: "258026", positions: [], phone: "", qqNumber: "1165175122", wechat: "未知" },
  { id: 258027, name: "赵周磊", photo: "https://q1.qlogo.cn/g?b=qq&nk=2268915034&s=100", gender: "男", studentId: "258027", positions: [], phone: "", qqNumber: "2268915034", wechat: "未知" },
  { id: 258028, name: "曾虹源", photo: "https://q1.qlogo.cn/g?b=qq&nk=3401407271&s=100", gender: "女", studentId: "258028", positions: [], phone: "", qqNumber: "3401407271", wechat: "未知" },
  { id: 258029, name: "常以丹", photo: "https://q1.qlogo.cn/g?b=qq&nk=3010590694&s=100", gender: "女", studentId: "258029", positions: [], phone: "", qqNumber: "3010590694", wechat: "未知" },
  { id: 258030, name: "陈依诺", photo: "https://q1.qlogo.cn/g?b=qq&nk=1129836339&s=100", gender: "女", studentId: "258030", positions: [], phone: "", qqNumber: "1129836339", wechat: "未知" },
  { id: 258031, name: "奉忆晨", photo: "https://q1.qlogo.cn/g?b=qq&nk=3577339401&s=100", gender: "女", studentId: "258031", positions: [], phone: "", qqNumber: "3577339401", wechat: "未知" },
  { id: 258032, name: "胡馨匀", photo: "https://q1.qlogo.cn/g?b=qq&nk=3452398414&s=100", gender: "女", studentId: "258032", positions: [], phone: "", qqNumber: "3452398414", wechat: "未知" },
  { id: 258033, name: "黄禹涵", photo: "https://q1.qlogo.cn/g?b=qq&nk=2740278553&s=100", gender: "女", studentId: "258033", positions: [], phone: "", qqNumber: "2740278553", wechat: "未知" },
  { id: 258034, name: "李飞雅菲", photo: "https://q1.qlogo.cn/g?b=qq&nk=1103132288&s=100", gender: "女", studentId: "258034", positions: [], phone: "", qqNumber: "1103132288", wechat: "未知" },
  { id: 258035, name: "李若歌", photo: "https://q1.qlogo.cn/g?b=qq&nk=229706712&s=100", gender: "女", studentId: "258035", positions: [], phone: "", qqNumber: "229706712", wechat: "未知" },
  { id: 258036, name: "李苡漫", photo: "https://q1.qlogo.cn/g?b=qq&nk=2383818556&s=100", gender: "女", studentId: "258036", positions: [], phone: "", qqNumber: "2383818556", wechat: "未知" },
  { id: 258037, name: "卢雨柯", photo: "https://q1.qlogo.cn/g?b=qq&nk=2914450466&s=100", gender: "女", studentId: "258037", positions: [], phone: "", qqNumber: "2914450466", wechat: "未知" },
  { id: 258038, name: "罗岚馨", photo: "https://q1.qlogo.cn/g?b=qq&nk=3536887180&s=100", gender: "女", studentId: "258038", positions: [], phone: "", qqNumber: "3536887180", wechat: "未知" },
  { id: 258039, name: "罗思雨", photo: "https://q1.qlogo.cn/g?b=qq&nk=2128900091&s=100", gender: "女", studentId: "258039", positions: [], phone: "", qqNumber: "2128900091", wechat: "未知" },
  { id: 258040, name: "庞慎思", photo: "https://q1.qlogo.cn/g?b=qq&nk=2243029406&s=100", gender: "女", studentId: "258040", positions: [], phone: "", qqNumber: "2243029406", wechat: "未知" },
  { id: 258041, name: "秦楚瑜", photo: "https://q1.qlogo.cn/g?b=qq&nk=3648597727&s=100", gender: "女", studentId: "258041", positions: [], phone: "", qqNumber: "3648597727", wechat: "未知" },
  { id: 258042, name: "秦紫馨", photo: "https://q1.qlogo.cn/g?b=qq&nk=3629016314&s=100", gender: "女", studentId: "258042", positions: [], phone: "", qqNumber: "3629016314", wechat: "未知" },
  { id: 258043, name: "盛子芮", photo: "https://q1.qlogo.cn/g?b=qq&nk=645926561&s=100", gender: "女", studentId: "258043", positions: [], phone: "", qqNumber: "645926561", wechat: "未知" },
  { id: 258044, name: "唐熙童", photo: "https://q1.qlogo.cn/g?b=qq&nk=1160977584&s=100", gender: "女", studentId: "258044", positions: [], phone: "", qqNumber: "1160977584", wechat: "未知" },
  { id: 258045, name: "唐亦含", photo: "https://q1.qlogo.cn/g?b=qq&nk=2075277247&s=100", gender: "女", studentId: "258045", positions: [], phone: "", qqNumber: "2075277247", wechat: "未知" },
  { id: 258046, name: "王昱霏", photo: "https://q1.qlogo.cn/g?b=qq&nk=1732134398&s=100", gender: "女", studentId: "258046", positions: [], phone: "", qqNumber: "1732134398", wechat: "未知" },
  { id: 258047, name: "韦佳欣", photo: "https://q1.qlogo.cn/g?b=qq&nk=3646305791&s=100", gender: "女", studentId: "258047", positions: [], phone: "", qqNumber: "3646305791", wechat: "未知" },
  { id: 258048, name: "白洛绫", photo: "https://q1.qlogo.cn/g?b=qq&nk=2908659382&s=100", gender: "女", studentId: "258048", positions: [], phone: "", qqNumber: "2908659382", wechat: "未知" },
  { id: 258049, name: "吴良琪", photo: "https://q1.qlogo.cn/g?b=qq&nk=3646109349&s=100", gender: "女", studentId: "258049", positions: [], phone: "", qqNumber: "3646109349", wechat: "未知" },
  { id: 258050, name: "羊瑾萱", photo: "https://q1.qlogo.cn/g?b=qq&nk=2279532014&s=100", gender: "女", studentId: "258050", positions: [], phone: "", qqNumber: "2279532014", wechat: "未知" },
  { id: 258051, name: "杨轲雯", photo: "https://q1.qlogo.cn/g?b=qq&nk=237676523&s=100", gender: "女", studentId: "258051", positions: [], phone: "", qqNumber: "237676523", wechat: "未知" },
  { id: 258052, name: "赵柳清", photo: "https://q1.qlogo.cn/g?b=qq&nk=191016508&s=100", gender: "女", studentId: "258052", positions: [], phone: "", qqNumber: "191016508", wechat: "未知" },
  { id: 258053, name: "黄一文", photo: "https://q1.qlogo.cn/g?b=qq&nk=1507428392&s=100", gender: "男", studentId: "258053", positions: [], phone: "", qqNumber: "1507428392", wechat: "未知" },
];

// 示例教师数据
const teachers: Teacher[] = [
  {
    id: 1,
    name: "雷雨",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen",
    gender: "男",
    subject: "历史",
    isClassTeacher: true,
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 2,
    name: "刘俊",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liu",
    gender: "男",
    subject: "数学",
    isClassTeacher: true,
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
   {
    id: 3,
    name: "雄运伟",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liu",
    gender: "男",
    subject: "数学",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 4,
    name: "班航",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liu",
    gender: "男",
    subject: "数学",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 5,
    name: "覃江丹",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yang",
    gender: "女",
    subject: "英语",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 6,
    name: "牛耕",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wang",
    gender: "男",
    subject: "英语",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 7,
    name: "黄老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huang",
    gender: "男",
    subject: "物理",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 8,
    name: "吴老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wu",
    gender: "女",
    subject: "化学",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
  },
  {
    id: 9,
    name: "郑老师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zheng",
    gender: "男",
    subject: "体育",
    phone: "未知",
    qqNumber: "未知",
    wechat: "未知",
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
