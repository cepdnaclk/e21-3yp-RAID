import { DollarSign, TrendingDown, Package, Wrench, Zap, Cpu } from "lucide-react";

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
        { name: "NEO-6M GPS Module", unitPrice: 12.0, quantity: 1, total: 12.0 },
      ],
    },
    {
      category: "Microcontroller & Communication",
      items: [
        { name: "ESP32 Development Board", unitPrice: 8.5, quantity: 1, total: 8.5 },
        { name: "SIM7600 4G LTE Module", unitPrice: 35.0, quantity: 1, total: 35.0 },
        { name: "SIM Card (IoT Plan)", unitPrice: 5.0, quantity: 1, total: 5.0 },
      ],
    },
    {
      category: "Power System",
      items: [
        { name: "12V 20Ah Lithium-ion Battery", unitPrice: 65.0, quantity: 1, total: 65.0 },
        { name: "Solar Panel 50W (optional)", unitPrice: 40.0, quantity: 1, total: 40.0 },
        { name: "Charging Controller", unitPrice: 15.0, quantity: 1, total: 15.0 },
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
        { name: "Resistors, Capacitors, LEDs", unitPrice: 5.0, quantity: 1, total: 5.0 },
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
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6">
              <Package className="w-10 h-10 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">Hardware (Per Unit)</div>
              <div className="text-3xl font-bold">${hardwareTotal.toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-6">
              <Zap className="w-10 h-10 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">Cloud (Monthly)</div>
              <div className="text-3xl font-bold">${cloudMonthlyTotal.toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl p-6">
              <Cpu className="w-10 h-10 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">Cloud (Yearly)</div>
              <div className="text-3xl font-bold">${cloudYearlyTotal.toFixed(2)}</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-xl p-6">
              <Wrench className="w-10 h-10 mb-3 opacity-80" />
              <div className="text-sm opacity-90 mb-1">Development</div>
              <div className="text-3xl font-bold">${developmentTotal.toFixed(2)}</div>
            </div>
          </div>

          {/* Total Project Cost */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total First Year Cost (Single Unit)</h2>
                <p className="text-slate-300">Includes hardware, cloud services for 1 year, and development</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">${(hardwareTotal + cloudYearlyTotal + developmentTotal).toFixed(2)}</div>
                <div className="text-slate-300 mt-2">One-time + Year 1 operational</div>
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

      {/* Cloud & Operational Costs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900">Cloud & Operational Costs</h2>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-slate-50 text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium text-right">Monthly</th>
                  <th className="px-6 py-4 font-medium text-right">Yearly</th>
                </tr>
              </thead>
              <tbody>
                {cloudCosts.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.service}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.description}</td>
                    <td className="px-6 py-4 text-right text-slate-900">${item.monthly.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-900">${item.yearly.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-green-600 text-white font-bold">
                  <td className="px-6 py-4" colSpan={2}>Total Operational Cost</td>
                  <td className="px-6 py-4 text-right">${cloudMonthlyTotal.toFixed(2)}/mo</td>
                  <td className="px-6 py-4 text-right">${cloudYearlyTotal.toFixed(2)}/yr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-slate-900 mb-1">Cost Scaling Note</div>
                <p className="text-sm text-slate-600">
                  Cloud costs scale with the number of devices deployed. The costs shown are per device. 
                  Volume discounts and reserved capacity can reduce costs by 30-40% at scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Costs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Wrench className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Development & Setup Costs</h2>
          </div>
          
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-slate-50 text-left text-sm text-slate-600">
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium text-center">Type</th>
                  <th className="px-6 py-4 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {developmentCosts.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0 bg-white">
                    <td className="px-6 py-4 text-slate-900">{item.item}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">${item.cost.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-purple-600 text-white font-bold">
                  <td className="px-6 py-4" colSpan={2}>Total Development Cost</td>
                  <td className="px-6 py-4 text-right">${developmentTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

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
              <h3 className="text-xl font-bold mb-4 text-green-400">RailGuard Automated System</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Hardware (one-time): <span className="font-bold">${hardwareTotal.toFixed(2)}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Development (one-time): <span className="font-bold">${developmentTotal.toFixed(2)}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span>Cloud services: <span className="font-bold">${cloudYearlyTotal.toFixed(2)}/year</span></span>
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
                  ${(hardwareTotal + developmentTotal + cloudYearlyTotal + 100).toFixed(2)}
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

      {/* ROI Analysis */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Return on Investment</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2-3 months</div>
              <div className="text-sm text-slate-600">Payback Period</div>
              <p className="text-xs text-slate-500 mt-2">Based on labor cost savings</p>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">$60K+</div>
              <div className="text-sm text-slate-600">Annual Savings</div>
              <p className="text-xs text-slate-500 mt-2">Compared to manual inspection</p>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">400%+</div>
              <div className="text-sm text-slate-600">5-Year ROI</div>
              <p className="text-xs text-slate-500 mt-2">Including accident prevention</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
