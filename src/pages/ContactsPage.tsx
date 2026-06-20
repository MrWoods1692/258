import React, { useState } from "react";
import { Copy, Check, Phone, MessageSquare, Search, X } from "lucide-react";
import { Navbar } from "@/components/class/Navbar";
import { ClassFooter } from "@/components/class/ClassFooter";


interface Contact {
  id: number;
  name: string;
  qqAvatar: string;
  qqNumber: string;
  phone: string;
  wechat: string;
}

// 学生数据
const contacts: Contact[] = [
  {
    id: 258001,
    name: "曾君涵",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2897180560&s=100",
    qqNumber: "2897180560",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258002,
    name: "常芮涵",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3662115535&s=100",
    qqNumber: "3662115535",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258003,
    name: "陈森林",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1692138502&s=100",
    qqNumber: "1692138502",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258004,
    name: "郭梓翰",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3640395948&s=100",
    qqNumber: "3640395948",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258005,
    name: "黄富耀",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2945397792&s=100",
    qqNumber: "2945397792",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258006,
    name: "蒋炎彬",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1474098028&s=100",
    qqNumber: "1474098028",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258007,
    name: "李皓阳",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=952695320&s=100",
    qqNumber: "952695320",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258008,
    name: "李加佳",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3504884267&s=100",
    qqNumber: "3504884267",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258009,
    name: "李俊熹",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1461877264&s=100",
    qqNumber: "1461877264",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258010,
    name: "李善楷",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=234611763&s=100",
    qqNumber: "234611763",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258011,
    name: "李彤宇",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3662322706&s=100",
    qqNumber: "3662322706",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258012,
    name: "李振宇",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1312076999&s=100",
    qqNumber: "1312076999",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258013,
    name: "廖力衡",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1786829995&s=100",
    qqNumber: "1786829995",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258014,
    name: "廖禹钧",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2558787083&s=100",
    qqNumber: "2558787083",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258015,
    name: "林继烨",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3807950084&s=100",
    qqNumber: "3807950084",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258016,
    name: "刘嘉明",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3038138931&s=100",
    qqNumber: "3038138931",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258017,
    name: "毛福涛",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2420558228&s=100",
    qqNumber: "2420558228",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258018,
    name: "莫智森",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3651239985&s=100",
    qqNumber: "3651239985",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258019,
    name: "施奕宏",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2935185929&s=100",
    qqNumber: "2935185929",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258020,
    name: "苏祉畅",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1720533352&s=100",
    qqNumber: "1720533352",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258021,
    name: "唐俊鑫",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3659519535&s=100",
    qqNumber: "3659519535",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258022,
    name: "田烨霖",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=8680458&s=100",
    qqNumber: "8680458",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258023,
    name: "肖何仁杰",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1728171096&s=100",
    qqNumber: "1728171096",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258024,
    name: "熊杰",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3489722469&s=100",
    qqNumber: "3489722469",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258025,
    name: "薛雅云",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2137855854&s=100",
    qqNumber: "2137855854",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258026,
    name: "张恒瑞",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1165175122&s=100",
    qqNumber: "1165175122",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258027,
    name: "赵周磊",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2268915034&s=100",
    qqNumber: "2268915034",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258028,
    name: "曾虹源",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3401407271&s=100",
    qqNumber: "3401407271",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258029,
    name: "常以丹",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3010590694&s=100",
    qqNumber: "3010590694",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258030,
    name: "陈依诺",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1129836339&s=100",
    qqNumber: "1129836339",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258031,
    name: "奉忆晨",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3577339401&s=100",
    qqNumber: "3577339401",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258032,
    name: "胡馨匀",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3452398414&s=100",
    qqNumber: "3452398414",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258033,
    name: "黄禹涵",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2740278553&s=100",
    qqNumber: "2740278553",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258034,
    name: "李飞雅菲",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1103132288&s=100",
    qqNumber: "1103132288",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258035,
    name: "李若歌",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=229706712&s=100",
    qqNumber: "229706712",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258036,
    name: "李苡漫",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2383818556&s=100",
    qqNumber: "2383818556",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258037,
    name: "卢雨柯",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2914450466&s=100",
    qqNumber: "2914450466",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258038,
    name: "罗岚馨",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3536887180&s=100",
    qqNumber: "3536887180",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258039,
    name: "罗思雨",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2128900091&s=100",
    qqNumber: "2128900091",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258040,
    name: "庞慎思",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2243029406&s=100",
    qqNumber: "2243029406",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258041,
    name: "秦楚瑜",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3648597727&s=100",
    qqNumber: "3648597727",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258042,
    name: "秦紫馨",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3629016314&s=100",
    qqNumber: "3629016314",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258043,
    name: "盛子芮",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=645926561&s=100",
    qqNumber: "645926561",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258044,
    name: "唐熙童",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1160977584&s=100",
    qqNumber: "1160977584",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258045,
    name: "唐亦含",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2075277247&s=100",
    qqNumber: "2075277247",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258046,
    name: "王昱霏",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1732134398&s=100",
    qqNumber: "1732134398",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258047,
    name: "韦佳欣",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3646305791&s=100",
    qqNumber: "3646305791",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258048,
    name: "白洛绫",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2908659382&s=100",
    qqNumber: "2908659382",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258049,
    name: "吴良琪",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=3646109349&s=100",
    qqNumber: "3646109349",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258050,
    name: "羊瑾萱",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=2279532014&s=100",
    qqNumber: "2279532014",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258051,
    name: "杨轲雯",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=237676523&s=100",
    qqNumber: "237676523",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258052,
    name: "赵柳清",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=191016508&s=100",
    qqNumber: "191016508",
    phone: "",
    wechat: "未知",
  },
  {
    id: 258053,
    name: "黄一文",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=1507428392&s=100",
    qqNumber: "1507428392",
    phone: "",
    wechat: "未知",
  },
];

const CopyableText = ({ text, icon }: { text: string; icon?: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted/50 transition-colors group relative"
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="font-yang-regular text-sm">{text}</span>
      {copied ? (
        <Check className="w-3 h-3 text-green-600 ml-1" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      )}
    </button>
  );
};

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.qqNumber.includes(q) ||
      contact.phone.includes(q) ||
      contact.wechat.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background paper-texture font-yang-regular text-foreground">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-yang-semibold mb-4">班级通讯录</h1>
          <p className="text-muted-foreground font-yang-regular">
            点击任意信息即可复制到剪贴板
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索姓名、QQ号、手机号、微信号..."
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card handwritten-border shadow-sm hover:shadow-elegant transition-all p-6 flex gap-6"
              >
                <div className="shrink-0">
                  <img
                    src={contact.qqAvatar}
                    alt={contact.name}
                    className="w-20 h-20 rounded-full border-2 border-border"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/100";
                    }}
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-yang-semibold">{contact.name}</h3>

                  <div className="space-y-2">
                    <CopyableText
                      text={contact.qqNumber}
                      icon={<MessageSquare className="w-4 h-4" />}
                    />
                    <CopyableText
                      text={contact.phone}
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <CopyableText text={contact.wechat} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-yang-regular text-muted-foreground">
                未找到匹配的联系人
              </p>
              <p className="text-sm font-yang-regular text-muted-foreground/60 mt-1">
                试试其他关键词
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground font-yang-regular">
            {filteredContacts.length > 0
              ? `共 ${filteredContacts.length} 位联系人${searchQuery ? `（已筛选）` : ""}`
              : ""}
          </p>
        </div>
      </main>

      <ClassFooter />
    </div>
  );
};

export default ContactsPage;
