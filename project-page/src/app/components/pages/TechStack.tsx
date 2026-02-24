import { Code2, Cpu, Database, Cloud, Smartphone, Wrench } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function TechStack() {
  const categories = [
    {
      title: "Embedded Systems",
      icon: Cpu,
      color: "blue",
      technologies: [
        { name: "ESP32", description: "Dual-core microcontroller with Wi-Fi/Bluetooth", version: "IDF 4.4" },
        { name: "FreeRTOS", description: "Real-time operating system", version: "10.4.3" },
        { name: "Arduino Framework", description: "Development framework for ESP32", version: "2.0.x" },
        { name: "PlatformIO", description: "IDE and build system", version: "6.1.x" },
      ],
    },
    {
      title: "Hardware Components",
      icon: Wrench,
      color: "green",
      technologies: [
        { name: "TCRT5000", description: "Infrared reflective sensor", version: "Industrial grade" },
        { name: "HC-SR04", description: "Ultrasonic distance sensor", version: "v2.0" },
        { name: "OV5640", description: "5MP camera module", version: "Auto-focus" },
        { name: "NEO-6M", description: "GPS module", version: "U-blox 6" },
        { name: "SIM7600", description: "4G LTE module", version: "Multi-band" },
        { name: "L298N", description: "Motor driver", version: "Dual H-bridge" },
      ],
    },
    {
      title: "Cloud & Backend",
      icon: Cloud,
      color: "purple",
      technologies: [
        { name: "AWS IoT Core", description: "Device connectivity and management", version: "MQTT 3.1.1" },
        { name: "AWS Lambda", description: "Serverless compute", version: "Python 3.11" },
        { name: "Amazon S3", description: "Object storage for images", version: "Standard" },
        { name: "DynamoDB", description: "NoSQL database", version: "On-demand" },
        { name: "CloudWatch", description: "Monitoring and logging", version: "Latest" },
        { name: "API Gateway", description: "RESTful API management", version: "HTTP API" },
      ],
    },
    {
      title: "Web Dashboard",
      icon: Smartphone,
      color: "amber",
      technologies: [
        { name: "React", description: "Frontend framework", version: "18.3.1" },
        { name: "TypeScript", description: "Type-safe JavaScript", version: "5.x" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework", version: "4.1" },
        { name: "Recharts", description: "Charting library", version: "2.15" },
        { name: "Leaflet", description: "Interactive maps", version: "1.9.x" },
        { name: "Vite", description: "Build tool", version: "6.3.x" },
      ],
    },
    {
      title: "Data & AI",
      icon: Database,
      color: "red",
      technologies: [
        { name: "OpenCV", description: "Computer vision library", version: "4.8" },
        { name: "TensorFlow Lite", description: "ML inference on edge", version: "2.14" },
        { name: "NumPy", description: "Numerical computing", version: "1.24" },
        { name: "Pandas", description: "Data analysis", version: "2.0" },
      ],
    },
    {
      title: "DevOps & Tools",
      icon: Code2,
      color: "slate",
      technologies: [
        { name: "Git", description: "Version control", version: "2.42" },
        { name: "Docker", description: "Containerization", version: "24.x" },
        { name: "GitHub Actions", description: "CI/CD pipeline", version: "v3" },
        { name: "Postman", description: "API testing", version: "10.x" },
      ],
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
      iconBg: "bg-blue-600",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
      iconBg: "bg-green-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
      iconBg: "bg-purple-600",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-200",
      iconBg: "bg-amber-600",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      border: "border-red-200",
      iconBg: "bg-red-600",
    },
    slate: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      iconBg: "bg-slate-600",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Technology Stack</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            A comprehensive overview of all technologies, frameworks, and tools used in the RailGuard system.
          </p>
        </div>
      </section>

      {/* Stack Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Modern & Scalable Technologies</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our technology stack is carefully selected to ensure reliability, scalability, and ease of maintenance. 
                We leverage industry-standard tools and frameworks that are well-documented and actively maintained.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Open Source First</div>
                    <div className="text-sm text-slate-600">Utilizing proven open-source technologies</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Cloud Native</div>
                    <div className="text-sm text-slate-600">Built for scalability and reliability</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">IoT Optimized</div>
                    <div className="text-sm text-slate-600">Low power and efficient communication</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1677092590812-78e7db4900d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBjaXJjdWl0JTIwYm9hcmQlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NzE4NzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="IoT Circuit Board"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Technology Categories */}
          <div className="space-y-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const colors = colorClasses[category.color as keyof typeof colorClasses];
              
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className={`${colors.bg} border-b ${colors.border} px-6 py-4`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-xl font-bold ${colors.text}`}>{category.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {category.technologies.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          <div className={`w-2 h-2 ${colors.iconBg} rounded-full mt-2 flex-shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-900 mb-1">{tech.name}</div>
                            <div className="text-sm text-slate-600 mb-2">{tech.description}</div>
                            <div className={`text-xs font-medium ${colors.text}`}>{tech.version}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Communication Protocols */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Communication Protocols</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">MQTT</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Lightweight messaging protocol</li>
                <li>• Quality of Service (QoS) levels 0-2</li>
                <li>• Publish/Subscribe pattern</li>
                <li>• Low bandwidth usage</li>
                <li>• Ideal for IoT devices</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">HTTP/HTTPS</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• RESTful API endpoints</li>
                <li>• JSON data format</li>
                <li>• SSL/TLS encryption</li>
                <li>• Image upload via multipart</li>
                <li>• Standard web protocols</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">WebSocket</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Real-time dashboard updates</li>
                <li>• Bi-directional communication</li>
                <li>• Low latency</li>
                <li>• Persistent connections</li>
                <li>• Live notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Development Tools */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Development Workflow</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Development</h3>
                <p className="text-sm text-slate-600">Code with PlatformIO & VS Code</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Testing</h3>
                <p className="text-sm text-slate-600">Unit tests & integration tests</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Build</h3>
                <p className="text-sm text-slate-600">Automated CI/CD pipeline</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Deploy</h3>
                <p className="text-sm text-slate-600">OTA updates to devices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Version Control */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Code Repository Structure</h2>
          
          <div className="bg-slate-900 rounded-xl p-6 text-slate-300 font-mono text-sm overflow-x-auto">
            <pre>{`railguard-project/
├── firmware/
│   ├── src/
│   │   ├── main.cpp
│   │   ├── sensors/
│   │   ├── communication/
│   │   └── config.h
│   ├── lib/
│   └── platformio.ini
│
├── cloud/
│   ├── lambda-functions/
│   ├── iot-policies/
│   └── infrastructure/
│
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── ml-models/
│   ├── training/
│   ├── inference/
│   └── datasets/
│
└── docs/
    ├── hardware/
    ├── software/
    └── api/`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
