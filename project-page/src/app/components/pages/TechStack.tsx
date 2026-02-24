const techCategories = [
  {
    title: "Embedded Systems",
    color: "bg-blue-50",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "ESP32",
        logo: "https://cdn.simpleicons.org/espressif/2564f2",
        desc: "Dual-core microcontroller with Wi-Fi/Bluetooth",
      },
      {
        name: "FreeRTOS",
        logo: "https://cdn.simpleicons.org/freertos/2C9AB7",
        desc: "Real-time operating system for embedded devices",
      },
      {
        name: "PlatformIO",
        logo: "https://cdn.simpleicons.org/platformio/F6822B",
        desc: "Embedded development ecosystem",
      },
      {
        name: "Arduino",
        logo: "https://cdn.simpleicons.org/arduino/00979D",
        desc: "Open-source electronics platform",
      },
    ],
  },
  {
    title: "Hardware Components",
    color: "bg-gray-50",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "TCRT5000",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/tcrt5000.svg",
        desc: "Infrared reflective sensor",
      },
      {
        name: "HC-SR04",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/hcsr04.svg",
        desc: "Ultrasonic distance sensor",
      },
      {
        name: "OV5640",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/ov5640.svg",
        desc: "5MP camera module",
      },
      {
        name: "NEO-6M",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/neo6m.svg",
        desc: "GPS module",
      },
      {
        name: "SIM7600",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/sim7600.svg",
        desc: "4G LTE module",
      },
      {
        name: "L298N",
        logo: "https://raw.githubusercontent.com/RAILGUARD-ICONS/sensors/main/l298n.svg",
        desc: "Dual H-bridge motor driver",
      },
    ],
  },
  {
    title: "Cloud & Backend",
    color: "bg-purple-50",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "Firebase Realtime Database",
        logo: "https://cdn.simpleicons.org/firebase/FFCA28",
        desc: "Cloud-hosted NoSQL database for real-time data sync",
      },
      {
        name: "Firebase Cloud Functions",
        logo: "https://cdn.simpleicons.org/firebasefunctions/4285F4",
        desc: "Serverless backend logic with event-driven functions",
      },
      {
        name: "Firebase Storage",
        logo: "https://cdn.simpleicons.org/googledrive/4285F4",
        desc: "Secure file uploads and storage",
      },
      {
        name: "Firebase Authentication",
        logo: "https://cdn.simpleicons.org/firebaseauth/FFCA28",
        desc: "User authentication and identity management",
      },
      {
        name: "Firebase Cloud Messaging",
        logo: "https://cdn.simpleicons.org/firebase/FFCA28",
        desc: "Push notifications and device messaging",
      },
      {
        name: "Firebase Hosting",
        logo: "https://cdn.simpleicons.org/firebase/FFCA28",
        desc: "Fast and secure static hosting",
      },
    ],
  },
  {
    title: "Web Dashboard / Mobile App",
    color: "bg-green-50",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "Flutter",
        logo: "https://cdn.simpleicons.org/flutter/02569B",
        desc: "Cross-platform UI toolkit for web and mobile",
      },
      {
        name: "Dart",
        logo: "https://cdn.simpleicons.org/dart/0175C2",
        desc: "Programming language for Flutter apps",
      },
      {
        name: "Provider",
        logo: "https://raw.githubusercontent.com/fluttercommunity/community/master/logos/provider.png",
        desc: "State management for Flutter",
      },
      {
        name: "Riverpod",
        logo: "https://raw.githubusercontent.com/rrousselGit/riverpod/master/resources/logo.png",
        desc: "Modern state management for Flutter",
      },
      {
        name: "Flutterfire",
        logo: "https://firebase.google.com/downloads/brand-guidelines/PNG/logo-vertical.png",
        desc: "Firebase integration for Flutter",
      },
      {
        name: "GetX",
        logo: "https://raw.githubusercontent.com/jonataslaw/getx-community/master/logo/getx.png",
        desc: "Powerful microframework for Flutter",
      },
    ],
  },
  {
    title: "AI & Data",
    color: "bg-orange-50",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "OpenCV",
        logo: "https://cdn.simpleicons.org/opencv/5C3EE8",
        desc: "Computer vision library",
      },
      {
        name: "TensorFlow Lite",
        logo: "https://cdn.simpleicons.org/tensorflow/FF6F00",
        desc: "ML inference on edge",
      },
      {
        name: "NumPy",
        logo: "https://cdn.simpleicons.org/numpy/013243",
        desc: "Numerical computing",
      },
      {
        name: "Pandas",
        logo: "https://cdn.simpleicons.org/pandas/150458",
        desc: "Data analysis",
      },
    ],
  },
  {
    title: "DevOps & Tools",
    color: "bg-slate-100",
    grid: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    items: [
      {
        name: "Git",
        logo: "https://cdn.simpleicons.org/git/F05032",
        desc: "Version control",
      },
      {
        name: "Docker",
        logo: "https://cdn.simpleicons.org/docker/2496ED",
        desc: "Containerization",
      },
      {
        name: "GitHub Actions",
        logo: "https://cdn.simpleicons.org/githubactions/2088FF",
        desc: "CI/CD pipeline",
      },
      {
        name: "Postman",
        logo: "https://cdn.simpleicons.org/postman/FF6C37",
        desc: "API testing",
      },
    ],
  },
];

export default function TechStack() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans">
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold mb-4 text-white tracking-tight text-left">Technology Stack</h1>
          <p className="text-lg text-white max-w-2xl text-left">
            Explore the modern technologies powering our IoT-based railway monitoring system.
          </p>
        </div>
      </section>
      {techCategories.map((cat) => (
        <section
          key={cat.title}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-10 text-slate-900">{cat.title}</h2>
            <div className={`grid ${cat.grid} gap-8`}>
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center bg-white/70 backdrop-blur-md border border-slate-100 rounded-2xl shadow-lg p-6 transition hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Only remove icon for Hardware Components section */}
                  {cat.title === "Hardware Components" ? null : (
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-14 h-14 object-contain mb-4"
                      loading="lazy"
                    />
                  )}
                  <div className="font-bold text-lg text-slate-900 mb-1 text-center">{item.name}</div>
                  <div className="text-sm text-slate-600 text-center">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Communication Protocols Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-10 text-slate-900 tracking-tight">Communication Protocols</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* MQTT Card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">MQTT</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-base">
                <li>Lightweight messaging protocol</li>
                <li>Quality of Service (QoS) levels 0-2</li>
                <li>Publish/Subscribe pattern</li>
                <li>Low bandwidth usage</li>
                <li>Ideal for IoT devices</li>
              </ul>
            </div>
            {/* HTTP/HTTPS Card */}
            <div className="rounded-2xl border border-green-100 bg-green-50/30 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">HTTP/HTTPS</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-base">
                <li>RESTful API endpoints</li>
                <li>JSON data format</li>
                <li>SSL/TLS encryption</li>
                <li>Image upload via multipart</li>
                <li>Standard web protocols</li>
              </ul>
            </div>
            {/* WebSocket Card */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-slate-900">WebSocket</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-base">
                <li>Real-time dashboard updates</li>
                <li>Bi-directional communication</li>
                <li>Low latency</li>
                <li>Persistent connections</li>
                <li>Live notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
