import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-primary-foreground/30 overflow-hidden">
                <img
                  src="https://cloudflarecnimg.scdn.io/i/6a34e71ead2d2_1781851934.jpg"
                  alt="班徽"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">258班</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              聚是一团火，散是满天星。258班（星火班）—— 我们共同的青春记忆。
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
                <span>桂林市奎光学校 258班（星火班）</span>
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 flex-shrink-0" />
                <span>星火三班 · 奋勇争先</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">班级格言</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>星火三班，奋勇争先</p>
              <p>挑战极限，勇夺桂冠</p>
              <p className="text-sm mt-4">聚是一团火，散是满天星</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/70">
          <p>{currentYear} 258班 · 星火班</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
