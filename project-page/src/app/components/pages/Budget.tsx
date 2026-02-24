import { TrendingDown, Package } from "lucide-react";

export default function Budget() {
  const hardwareCosts = [
    {
      category: "Sensors",
      items: [
        { name: "TCRT5000 IR Sensor (x2)", unitPrice: 3.5, quantity: 2, total: 7.0 },
        { name: "HC-SR04 Ultrasonic Sensor (x2)", unitPrice: 4.0, quantity: 2, total: 8.0 },
      ],
    },
    {
      category: "Camera & GPS",
      items: [
        { name: "OV5640 5MP Camera Module", unitPrice: 18.0, quantity: 1, total: 18.0 },
        { name: "NEO-7M GPS Module", unitPrice: 12.0, quantity: 1, total: 12.0 },
      ],
    },
    {
      category: "Microcontroller & Communication",
      items: [
        { name: "ESP32 Development Board", unitPrice: 8.5, quantity: 1, total: 8.5 },
        { name: "SIM Card", unitPrice: 5.0, quantity: 1, total: 5.0 }
      ],
    },
    {
      category: "Power System",
      items: [
        { name: "12V 20Ah Lithium-ion Battery", unitPrice: 65.0, quantity: 1, total: 65.0 },
        { name: "Charging Controller", unitPrice: 15.0, quantity: 1, total: 15.0 }
      ],
    },
    {
      category: "Motors & Mechanical",
      items: [
        { name: "DC Gear Motors (x2)", unitPrice: 12.0, quantity: 2, total: 24.0 },
        { name: "L298N Motor Driver", unitPrice: 6.5, quantity: 1, total: 6.5 },
        { name: "Wheels & Axles", unitPrice: 15.0, quantity: 1, total: 15.0 },
        { name: "Chassis (Aluminum)", unitPrice: 30.0, quantity: 1, total: 30.0 },
        { name: "Fasteners & Hardware", unitPrice: 10.0, quantity: 1, total: 10.0 },
      ],
    },
    {
      category: "Electronics & Wiring",
      items: [
        { name: "PCB for Integration", unitPrice: 20.0, quantity: 1, total: 20.0 },
        { name: "Cables & Connectors", unitPrice: 8.0, quantity: 1, total: 8.0 },
        { name: "Voltage Regulators", unitPrice: 5.0, quantity: 2, total: 10.0 },
      ],
    },
    {
      category: "Enclosure & Protection",
      items: [
        { name: "IP65 Enclosure Box", unitPrice: 25.0, quantity: 1, total: 25.0 },
        { name: "Sealing Gaskets", unitPrice: 8.0, quantity: 1, total: 8.0 },
      ],
    },
  ];

  const cloudCosts = [
    { service: "AWS IoT Core", description: "Device connectivity (1 device)", monthly: 0.8, yearly: 9.6 },
    { service: "AWS Lambda", description: "Compute (5000 invocations/day)", monthly: 2.5, yearly: 30.0 },
    { service: "Amazon S3", description: "Image storage (50 GB)", monthly: 1.2, yearly: 14.4 },
    { service: "DynamoDB", description: "Database (On-demand)", monthly: 3.0, yearly: 36.0 },
    { service: "CloudWatch", description: "Monitoring & Logs", monthly: 1.5, yearly: 18.0 },
    { service: "Data Transfer", description: "Outbound data (10 GB/month)", monthly: 0.9, yearly: 10.8 },
    { service: "4G Data Plan", description: "Cellular data (5 GB/month)", monthly: 10.0, yearly: 120.0 },
  ];

  const developmentCosts = [
    { item: "Development Tools & Software Licenses", cost: 150.0, type: "one-time" },
    { item: "Testing Equipment & Supplies", cost: 200.0, type: "one-time" },
    { item: "Prototyping Materials", cost: 100.0, type: "one-time" },
    { item: "Documentation & Manuals", cost: 50.0, type: "one-time" },
  ];

  const calculateCategoryTotal = (category: any) => {
    return category.items.reduce((sum: number, item: any) => sum + item.total, 0);
  };

  const hardwareTotal = hardwareCosts.reduce((sum, category) => sum + calculateCategoryTotal(category), 0);
  const cloudMonthlyTotal = cloudCosts.reduce((sum, item) => sum + item.monthly, 0);
  const cloudYearlyTotal = cloudCosts.reduce((sum, item) => sum + item.yearly, 0);
  const developmentTotal = developmentCosts.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Project Budget</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Detailed cost breakdown including hardware components, cloud infrastructure, and development expenses.
          </p>
        </div>
      </section>

      {/* Budget Summary */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 w-full md:w-1/3">
              <Package className="w-10 h-10 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">Hardware (Per Unit)</div>
              <div className="text-3xl font-bold">${hardwareTotal.toFixed(2)}</div>
            </div>
          </div>

          {/* Total Hardware Cost */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Hardware Cost (Single Unit)</h2>
                <p className="text-slate-300">One-time hardware costs per device</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">${hardwareTotal.toFixed(2)}</div>
                <div className="text-slate-300 mt-2">One-time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Costs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">Hardware Components</h2>
          </div>
          
          <div className="space-y-6">
            {hardwareCosts.map((category, index) => (
              <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{category.category}</h3>
                    <div className="text-lg font-bold text-blue-600">
                      ${calculateCategoryTotal(category).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-slate-600 border-b border-slate-200">
                        <th className="pb-3 font-medium">Component</th>
                        <th className="pb-3 font-medium text-right">Unit Price</th>
                        <th className="pb-3 font-medium text-center">Qty</th>
                        <th className="pb-3 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {category.items.map((item, itemIndex) => (
                        <tr key={itemIndex} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 text-slate-900">{item.name}</td>
                          <td className="py-3 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                          <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-3 text-right font-medium text-slate-900">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="bg-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Total Hardware Cost per Unit</div>
                <div className="text-3xl font-bold">${hardwareTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Removed Cloud & Operational Costs and Development & Setup Costs sections */}

      {/* Cost Comparison */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Cost Comparison vs. Traditional Methods</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">Traditional Manual Inspection</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Inspector salary: <span className="font-bold">$50,000-$70,000/year</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Safety equipment & training: <span className="font-bold">$5,000/year</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Vehicle/transport costs: <span className="font-bold">$10,000/year</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Insurance & liability: <span className="font-bold">$8,000/year</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Limited coverage: <span className="font-bold">Periodic checks only</span></span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-sm opacity-80">Annual Cost (approx.)</div>
                <div className="text-3xl font-bold text-red-400">$73,000+</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">RAID Automated System</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Hardware (one-time): <span className="font-bold">${hardwareTotal.toFixed(2)}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Maintenance: <span className="font-bold">$100/year</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Coverage: <span className="font-bold">24/7 continuous monitoring</span></span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-sm opacity-80">First Year Cost</div>
                <div className="text-3xl font-bold text-green-400">
                  ${(hardwareTotal + 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-500/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">Cost Savings</h3>
            </div>
            <p className="text-slate-200">
              After the first year, operational costs drop to ~${(cloudYearlyTotal + 100).toFixed(2)}/year, 
              resulting in <span className="font-bold text-green-400">98% cost reduction</span> compared to 
              traditional methods while providing superior 24/7 coverage.
            </p>
          </div>
        </div>
      </section>

      {/* ROI Analysis removed */}
    </div>
  );
}
