import { Mail, Linkedin, Github, Award } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function Team() {
  const teamMembers = [
    {
      name: "Your Name",
      role: "Project Lead & Hardware Engineer",
      description: "Responsible for system architecture, hardware design, and sensor integration. Led the development of the autonomous navigation system.",
      expertise: ["Embedded Systems", "IoT", "Robotics"],
      email: "lead@railguard.project",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Team Member 2",
      role: "Software Engineer",
      description: "Developed cloud infrastructure, backend APIs, and real-time dashboard. Implemented machine learning algorithms for crack detection.",
      expertise: ["Cloud Architecture", "Full-Stack", "ML/AI"],
      email: "dev@railguard.project",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Team Member 3",
      role: "Electronics Engineer",
      description: "Designed PCB layout, power management system, and sensor calibration. Ensured system reliability and weather resistance.",
      expertise: ["Circuit Design", "Power Systems", "Testing"],
      email: "hardware@railguard.project",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Team Member 4",
      role: "Data Analyst",
      description: "Conducted field testing, analyzed detection accuracy, and optimized algorithms. Created comprehensive documentation and reports.",
      expertise: ["Data Analysis", "Testing", "Documentation"],
      email: "analyst@railguard.project",
      linkedin: "#",
      github: "#",
    },
  ];

  const advisors = [
    {
      name: "Dr. Faculty Advisor",
      role: "Academic Supervisor",
      institution: "University/College Name",
      contribution: "Provided guidance on project methodology and research approach",
    },
    {
      name: "Industry Expert",
      role: "Railway Engineering Consultant",
      institution: "Railway Authority/Company",
      contribution: "Offered insights on railway infrastructure and safety standards",
    },
  ];

  const achievements = [
    { icon: Award, text: "Best Engineering Project 2025" },
    { icon: Award, text: "Innovation in IoT Award" },
    { icon: Award, text: "Top 10 Student Projects" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Meet the passionate individuals behind RailGuard who combined their expertise to create an innovative railway safety solution.
          </p>
        </div>
      </section>

      {/* Team Photo */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden mb-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760611656007-f767a8082758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwZW5naW5lZXJzJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzE4NzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Team Collaboration"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Core Team Members</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                    <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <a
                        href={member.linkedin}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.github}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors & Mentors */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Advisors & Mentors</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                  {advisor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{advisor.name}</h3>
                <div className="text-purple-600 font-medium text-sm mb-2">{advisor.role}</div>
                <div className="text-slate-600 text-sm mb-3">{advisor.institution}</div>
                <p className="text-slate-600 text-sm italic">"{advisor.contribution}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Achievements & Recognition</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-200 p-6 text-center"
                >
                  <Icon className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <div className="font-medium text-slate-900">{achievement.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-slate-300">Pushing boundaries with creative solutions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold mb-2">Safety First</h3>
              <p className="text-sm text-slate-300">Prioritizing railway safety above all</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">Collaboration</h3>
              <p className="text-sm text-slate-300">Working together towards common goals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Excellence</h3>
              <p className="text-sm text-slate-300">Striving for quality in every detail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Development Timeline */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Development Journey</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-slate-900 mb-1">Research & Planning</h3>
                  <p className="text-sm text-slate-600">Identified problem, researched solutions, and designed system architecture</p>
                  <p className="text-xs text-blue-600 mt-1">Month 1-2</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div className="w-0.5 h-full bg-green-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-slate-900 mb-1">Prototype Development</h3>
                  <p className="text-sm text-slate-600">Built initial hardware prototype and developed core software components</p>
                  <p className="text-xs text-green-600 mt-1">Month 3-5</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div className="w-0.5 h-full bg-amber-200 mt-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-slate-900 mb-1">Testing & Refinement</h3>
                  <p className="text-sm text-slate-600">Conducted extensive testing, gathered data, and optimized algorithms</p>
                  <p className="text-xs text-amber-600 mt-1">Month 6-7</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Documentation & Presentation</h3>
                  <p className="text-sm text-slate-600">Finalized documentation, created presentations, and demonstrated the system</p>
                  <p className="text-xs text-purple-600 mt-1">Month 8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
