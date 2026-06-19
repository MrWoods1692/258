import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">XX学校</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              秉承"追求卓越、成就未来"的办学理念，致力于培养德智体美劳全面发展的优秀人才，为社会发展贡献力量。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              联系方式
            </h3>
            <div className="space-y-3 text-primary-foreground/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>XX省XX市XX区XX路XX号</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>0123-12345678</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>xxxxx@163.com</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">办公时间</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>周一至周五：8:00 - 17:30</p>
              <p>周六至周日：9:00 - 16:00</p>
              <p className="text-sm mt-4">节假日办公时间请关注学校公告</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/70">
          <p>{currentYear} XX学校</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
