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

// 示例数据
const contacts: Contact[] = [
  {
    id: 1,
    name: "张三",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=10001&s=100",
    qqNumber: "1234567890",
    phone: "13800138000",
    wechat: "zhangsan_wx",
  },
  {
    id: 2,
    name: "李四",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=10002&s=100",
    qqNumber: "2345678901",
    phone: "13900139000",
    wechat: "lisi_wx",
  },
  {
    id: 3,
    name: "王五",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=10003&s=100",
    qqNumber: "3456789012",
    phone: "13700137000",
    wechat: "wangwu_wx",
  },
  {
    id: 4,
    name: "赵六",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=10004&s=100",
    qqNumber: "4567890123",
    phone: "13600136000",
    wechat: "zhaoliu_wx",
  },
  {
    id: 5,
    name: "孙七",
    qqAvatar: "https://q1.qlogo.cn/g?b=qq&nk=10005&s=100",
    qqNumber: "5678901234",
    phone: "13500135000",
    wechat: "sunqi_wx",
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
