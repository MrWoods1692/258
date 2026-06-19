import { History, Target, Trophy, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AboutPage = () => {
  const { ref: historyRef, isVisible: historyVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: philosophyRef, isVisible: philosophyVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: honorsRef, isVisible: honorsVisible } = useScrollAnimation({ threshold: 0.1 });
  const { ref: facilitiesRef, isVisible: facilitiesVisible } = useScrollAnimation({ threshold: 0.1 });
  const milestones = [
    { year: "1970", event: "学校正式成立，开启教育征程" },
    { year: "1985", event: "被评为省级重点学校" },
    { year: "2000", event: "完成现代化校园改造" },
    { year: "2010", event: "获得国家级示范学校称号" },
    { year: "2020", event: "建成智慧校园系统" }
  ];

  const honors = [
    "全国教育系统先进集体",
    "省级文明校园",
    "市级教学质量优秀学校",
    "科技创新教育示范学校",
    "德育工作先进单位",
    "体育传统项目学校"
  ];

  const facilities = [
    {
      name: "教学楼",
      description: "配备现代化多媒体教室，为学生提供优质的学习环境"
    },
    {
      name: "实验室",
      description: "物理、化学、生物实验室设备齐全，满足各类实验需求"
    },
    {
      name: "图书馆",
      description: "藏书丰富，提供安静舒适的阅读和自习空间"
    },
    {
      name: "体育设施",
      description: "标准运动场、体育馆、游泳池等设施完善"
    },
    {
      name: "艺术中心",
      description: "音乐教室、美术教室、舞蹈室等专业艺术教学场所"
    },
    {
      name: "学生宿舍",
      description: "温馨舒适的住宿环境，配备完善的生活设施"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 gradient-text">
            学校概况
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            深入了解XX学校的发展历程、办学理念和辉煌成就
          </p>
        </div>

        <div ref={historyRef}>
          <Card className={`mb-12 border-2 hover-lift transition-all duration-500 ${historyVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <History className="w-7 h-7 text-primary" />
                历史沿革
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-8">
                XX学校创建于1970年，是一所具有深厚历史底蕴的知名学府。
                建校五十多年来，学校始终坚持"立德树人"的根本任务，
                秉承"追求卓越、成就未来"的办学理念，为社会培养了大批优秀人才。
                学校经历了从传统教育到现代化教育的转型，不断创新教育模式，
                提升教学质量，成为区域内具有重要影响力的教育机构。
              </p>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-20 flex-shrink-0">
                      <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold transition-transform group-hover:scale-110">
                        {milestone.year}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-foreground group-hover:text-primary transition-colors">
                        {milestone.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={philosophyRef}>
          <Card className={`mb-12 border-2 hover-lift transition-all duration-500 ${philosophyVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="w-7 h-7 text-primary" />
                办学理念与特色
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">办学理念</h3>
                <p className="text-muted-foreground leading-relaxed">
                  学校坚持"以人为本、全面发展"的教育理念，注重学生德智体美劳全面发展。
                  我们相信每个学生都有独特的潜能，通过科学的教育方法和个性化的培养方案，
                  帮助每一位学生发现自我、超越自我，成为对社会有用的人才。
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">办学特色</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span><strong>素质教育：</strong>注重培养学生的创新精神和实践能力，开展丰富多彩的课外活动</span>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span><strong>因材施教：</strong>实施分层教学和个性化辅导，满足不同学生的学习需求</span>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span><strong>国际视野：</strong>开展国际交流合作，培养具有全球竞争力的优秀人才</span>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <span><strong>科技创新：</strong>重视科技教育，建设创客空间，激发学生创新潜能</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={honorsRef}>
          <Card className={`mb-12 border-2 hover-lift transition-all duration-500 ${honorsVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Trophy className="w-7 h-7 text-primary" />
                学校荣誉
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                多年来，学校在教育教学、科研创新、德育工作等方面取得了显著成绩，
                获得了各级政府和教育部门的表彰与认可。
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {honors.map((honor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all hover:scale-105 hover:shadow-md"
                  >
                    <Trophy className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{honor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={facilitiesRef}>
          <Card className={`border-2 hover-lift transition-all duration-500 ${facilitiesVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <ImageIcon className="w-7 h-7 text-primary" />
                校园风光与设施
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                学校占地面积广阔，校园环境优美，绿树成荫，四季花开。
                现代化的教学设施和完善的生活配套为师生提供了良好的工作学习环境。
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {facilities.map((facility, index) => (
                  <Card key={index} className="border hover:border-primary/50 transition-all hover-lift">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-2 text-primary">
                        {facility.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {facility.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
                  <img
                    src="https://miaoda-site-img.cdn.bcebos.com/images/c42ca063-9d1a-43c3-80a9-43bf331e7ae0.jpg"
                    alt="校园景观1"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg group">
                  <img
                    src="https://miaoda-site-img.cdn.bcebos.com/images/5761d4bf-7485-4efb-8f53-903469fedc1e.jpg"
                    alt="校园景观2"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
