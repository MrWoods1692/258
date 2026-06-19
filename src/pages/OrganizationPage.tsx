import { Building2, Users, BookOpen, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const OrganizationPage = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const leadership = [
    {
      name: "张XX",
      position: "校长",
      description: "全面负责学校行政管理工作，主持学校日常事务"
    },
    {
      name: "李XX",
      position: "副校长（教学）",
      description: "分管教学工作，负责教学质量监控和课程建设"
    },
    {
      name: "王XX",
      position: "副校长（德育）",
      description: "分管德育工作，负责学生管理和思想政治教育"
    },
    {
      name: "刘XX",
      position: "副校长（后勤）",
      description: "分管后勤保障工作，负责校园安全和设施维护"
    }
  ];

  const departments = [
    {
      name: "教务处",
      icon: BookOpen,
      responsibilities: [
        "制定和实施教学计划",
        "组织教学质量评估",
        "管理教师教学工作",
        "协调课程安排"
      ]
    },
    {
      name: "学生处",
      icon: Users,
      responsibilities: [
        "学生日常管理",
        "德育工作开展",
        "学生活动组织",
        "心理健康教育"
      ]
    },
    {
      name: "总务处",
      icon: Building2,
      responsibilities: [
        "校园设施维护",
        "后勤保障服务",
        "财务管理",
        "安全保卫工作"
      ]
    },
    {
      name: "办公室",
      icon: Briefcase,
      responsibilities: [
        "行政事务协调",
        "文件档案管理",
        "对外联络接待",
        "信息宣传工作"
      ]
    }
  ];

  const academicDivisions = [
    {
      name: "文科部",
      subjects: ["语文", "英语", "历史", "地理", "政治"],
      description: "负责文科类课程的教学和研究工作"
    },
    {
      name: "理科部",
      subjects: ["数学", "物理", "化学", "生物"],
      description: "负责理科类课程的教学和研究工作"
    },
    {
      name: "艺体部",
      subjects: ["音乐", "美术", "体育", "舞蹈"],
      description: "负责艺术和体育类课程的教学工作"
    },
    {
      name: "信息技术部",
      subjects: ["计算机", "信息技术", "人工智能"],
      description: "负责信息技术类课程和智慧校园建设"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        <div ref={titleRef} className={`text-center mb-12 ${titleVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 gradient-text">
            机构设置
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            完善的组织架构，专业的管理团队，为教育教学提供有力保障
          </p>
        </div>

        <Tabs defaultValue="structure" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 xl:grid-cols-4 h-auto">
            <TabsTrigger value="structure" className="text-base py-3">
              组织架构
            </TabsTrigger>
            <TabsTrigger value="leadership" className="text-base py-3">
              领导班子
            </TabsTrigger>
            <TabsTrigger value="departments" className="text-base py-3">
              职能部门
            </TabsTrigger>
            <TabsTrigger value="academic" className="text-base py-3">
              院系设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            <Card className="border-2 hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl">学校组织架构</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-primary text-primary-foreground rounded-lg hover:shadow-xl transition-all hover:scale-105">
                    <h3 className="text-xl font-bold">校长办公会</h3>
                    <p className="text-sm mt-2 text-primary-foreground/80">
                      学校最高决策机构
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105 hover:shadow-md">
                      <h4 className="font-semibold text-lg mb-2">教学管理</h4>
                      <p className="text-sm text-muted-foreground">
                        教务处、教研室
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105 hover:shadow-md">
                      <h4 className="font-semibold text-lg mb-2">学生管理</h4>
                      <p className="text-sm text-muted-foreground">
                        学生处、团委
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105 hover:shadow-md">
                      <h4 className="font-semibold text-lg mb-2">行政后勤</h4>
                      <p className="text-sm text-muted-foreground">
                        办公室、总务处
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {academicDivisions.map((division, index) => (
                      <div
                        key={index}
                        className="text-center p-4 bg-accent/10 rounded-lg border-2 border-accent/20 hover:border-accent/50 transition-all hover:scale-105 hover:shadow-md"
                      >
                        <h4 className="font-semibold text-primary mb-1">
                          {division.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {division.subjects.length}个学科
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leadership" className="space-y-6">
            <Card className="border-2 hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl">领导班子</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {leadership.map((leader, index) => (
                    <Card key={index} className="border hover:border-primary/50 transition-all hover-lift">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Users className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                            <p className="text-primary font-semibold mb-2">
                              {leader.position}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {leader.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card className="border-2 hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl">职能部门</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {departments.map((dept, index) => (
                    <Card key={index} className="border-2 hover:border-primary/50 transition-all hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                            <dept.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                          </div>
                          <span className="text-xl">{dept.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3 text-muted-foreground">
                          主要职责：
                        </h4>
                        <ul className="space-y-2">
                          {dept.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2 group">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                              <span className="text-sm text-foreground">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card className="border-2 hover-lift animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-2xl">院系设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {academicDivisions.map((division, index) => (
                    <Card key={index} className="border-2 hover:border-primary/50 transition-all hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                            <BookOpen className="w-6 h-6 text-accent-foreground" />
                          </div>
                          <span className="text-xl">{division.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {division.description}
                        </p>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                            开设学科：
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {division.subjects.map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizationPage;
