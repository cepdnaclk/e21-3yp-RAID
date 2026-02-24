import { Link } from "react-router";
import { 
  Shield, 
  Clock, 
  TrendingDown, 
  Network, 
  CheckCircle2, 
  ArrowRight,
  Camera,
  MapPin,
  Cloud
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: "Improved Safety",
      description: "Early crack detection significantly reduces the risk of derailments and accidents",
    },
    {
      icon: Clock,
      title: "Real-Time Monitoring",
      description: "Enables immediate alerts and faster decision-making for maintenance teams",
    },
    {
      icon: TrendingDown,
      title: "Reduced Human Risk",
      description: "Minimizes the need for manual track inspections in dangerous environments",
    },
    {
      icon: Network,
      title: "Cost-Effective",
      description: "Prevents minor defects from developing into major infrastructure failures",
    },
  ];

  const detectionFeatures = [
    {
      icon: Camera,
      title: "Visual Capture",
      description: "Onboard camera captures clear images of defects",
    },
    {
      icon: MapPin,
      title: "GPS Tracking",
      description: "Precise location data for every detected issue",
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Instant data upload to monitoring dashboard",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-200">IoT-Powered Railway Safety</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Autonomous Railway Track
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Crack Detection
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Real-time monitoring system that detects track defects early, reducing accidents and maintenance costs through IoT automation.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/specifications"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Specifications
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/architecture"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  See Architecture
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1653813705905-472ea6eac827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwdHJhY2slMjBpbnNwZWN0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NzM1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Railway Track Inspection"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">The Challenge</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Real-World Problem</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Railway track failures caused by cracks, wear, and structural defects are a major reason for train derailments and service disruptions worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Manual Inspection Limitations</h3>
                  <p className="text-slate-600">
                    Traditional methods are time-consuming, expensive, and expose workers to dangerous environments.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Early Detection Failures</h3>
                  <p className="text-slate-600">
                    Often fail to detect small or early-stage cracks, allowing defects to worsen and increasing accident risk.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Slow Response Times</h3>
                  <p className="text-slate-600">
                    Lack of real-time monitoring makes it difficult for teams to respond quickly and efficiently.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="text-6xl font-bold text-red-500 mb-2">57%</div>
                <p className="text-slate-600 mb-6">of railway accidents are related to track defects</p>
                <div className="text-6xl font-bold text-amber-500 mb-2">$3.2B</div>
                <p className="text-slate-600">annual cost of railway maintenance globally</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Our Solution</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Intelligent Detection System</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              An autonomous IoT-based robot that continuously monitors railway tracks using advanced sensors and provides real-time alerts through cloud integration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {detectionFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Scan</h4>
                <p className="text-sm text-slate-600">Robot moves along tracks using IR and ultrasonic sensors</p>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Detect</h4>
                <p className="text-sm text-slate-600">Identifies cracks and surface irregularities with high accuracy</p>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Capture</h4>
                <p className="text-sm text-slate-600">Camera takes images and GPS records exact location</p>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  4
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Alert</h4>
                <p className="text-sm text-slate-600">Data uploaded to cloud dashboard for immediate action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Impact</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Key Benefits</h2>
            <p className="text-lg text-slate-600">
              Our system delivers measurable improvements in safety, efficiency, and cost reduction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <p className="text-blue-100">Continuous Monitoring</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%+</div>
                <p className="text-blue-100">Detection Accuracy</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <p className="text-blue-100">Cost Reduction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scalability */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <CheckCircle2 className="w-12 h-12 text-green-400 mb-6" />
              <h2 className="text-4xl font-bold mb-6">Scalable Solution</h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Designed to be deployed across large railway networks and seamlessly integrated with existing maintenance management systems.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Compatible with all standard gauge tracks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Cloud-based centralized monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">API integration with existing systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Modular design for easy maintenance</span>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1768323275769-6615e7cfcbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbm9tb3VzJTIwcm9ib3QlMjBzZW5zb3IlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MTg3MzUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Autonomous Robot Technology"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Learn More?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore the technical details, architecture, and implementation of this innovative solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tech-stack"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
            >
              View Tech Stack
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
