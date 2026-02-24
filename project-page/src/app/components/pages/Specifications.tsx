import { Cpu, Gauge, Camera, MapPin, Radio, Wifi } from "lucide-react";

export default function Specifications() {
  const hardwareSpecs = [
    {
      category: "Sensors",
      icon: Gauge,
      items: [
        { name: "IR Sensors", spec: "2x TCRT5000, Detection Range: 1-8mm" },
        { name: "Ultrasonic Sensors", spec: "HC-SR04, Range: 2-400cm, Frequency: 40kHz" },
        { name: "Accuracy", spec: "±1mm for crack detection" },
      ],
    },
    {
      category: "Camera Module",
      icon: Camera,
      items: [
        { name: "Resolution", spec: "5MP, 1080p video recording" },
        { name: "Field of View", spec: "160° wide-angle lens" },
        { name: "Low Light", spec: "Night vision capability with IR LEDs" },
      ],
    },
    {
      category: "GPS Module",
      icon: MapPin,
      items: [
        { name: "Accuracy", spec: "±2.5m CEP (Circular Error Probable)" },
        { name: "Update Rate", spec: "1Hz-10Hz configurable" },
        { name: "Satellites", spec: "GPS, GLONASS, Galileo support" },
      ],
    },
    {
      category: "Microcontroller",
      icon: Cpu,
      items: [
        { name: "Processor", spec: "ESP32 Dual-Core 240MHz" },
        { name: "Memory", spec: "520KB SRAM, 4MB Flash" },
        { name: "Connectivity", spec: "Wi-Fi 802.11 b/g/n, Bluetooth 4.2" },
      ],
    },
    {
      category: "Communication",
      icon: Radio,
      items: [
        { name: "Primary", spec: "4G LTE Module (SIM7600)" },
        { name: "Backup", spec: "Wi-Fi (ESP32 integrated)" },
        { name: "Range", spec: "Up to 50km with cellular" },
      ],
    },
    {
      category: "Power System",
      icon: Wifi,
      items: [
        { name: "Battery", spec: "12V 20Ah Lithium-ion" },
        { name: "Runtime", spec: "8-10 hours continuous operation" },
        { name: "Charging", spec: "Solar panel compatible (50W)" },
      ],
    },
  ];

  const mechanicalSpecs = [
    { label: "Dimensions", value: "45cm x 30cm x 25cm (L x W x H)" },
    { label: "Weight", value: "8.5 kg (with battery)" },
    { label: "Maximum Speed", value: "2.5 km/h on tracks" },
    { label: "Track Gauge", value: "Standard gauge (1435mm) compatible" },
    { label: "Weather Resistance", value: "IP65 rated (dust and water resistant)" },
    { label: "Operating Temperature", value: "-10°C to 50°C" },
  ];

  const softwareSpecs = [
    { label: "Operating System", value: "FreeRTOS on ESP32" },
    { label: "Programming Language", value: "C/C++ (Arduino Framework)" },
    { label: "Cloud Platform", value: "AWS IoT Core / Firebase" },
    { label: "Data Protocol", value: "MQTT for real-time communication" },
    { label: "Image Processing", value: "OpenCV for crack detection" },
    { label: "Dashboard", value: "React.js web application" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Technical Specifications</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Detailed hardware and software specifications of the RailGuard autonomous track monitoring system.
          </p>
        </div>
      </section>

      {/* Hardware Specifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Hardware Components</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardwareSpecs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{spec.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {spec.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium text-slate-900">{item.name}:</span>
                        <span className="text-slate-600 ml-1">{item.spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mechanical Specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Mechanical Design</h2>
          
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {mechanicalSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-slate-900 mb-1">{spec.label}</div>
                      <div className="text-slate-600">{spec.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Specifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Software Stack</h2>
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="space-y-4">
                {softwareSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="font-medium text-slate-900 mb-2 sm:mb-0">{spec.label}</div>
                    <div className="text-slate-600 sm:text-right">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Performance Metrics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-slate-600">Crack Detection Accuracy</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2.5 km/h</div>
              <div className="text-sm text-slate-600">Maximum Speed</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">8-10h</div>
              <div className="text-sm text-slate-600">Battery Life</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">±2.5m</div>
              <div className="text-sm text-slate-600">GPS Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Environmental Compliance</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Weather Resistance</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• IP65 dust and water protection</li>
                <li>• Corrosion-resistant materials</li>
                <li>• UV-resistant exterior coating</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Temperature Range</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Operating: -10°C to 50°C</li>
                <li>• Storage: -20°C to 60°C</li>
                <li>• Thermal management system</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Safety Standards</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• EN 50126 (Railway Safety)</li>
                <li>• ISO 9001 Quality Management</li>
                <li>• CE certified components</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
