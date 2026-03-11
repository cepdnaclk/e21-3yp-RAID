import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, Zap } from "lucide-react";

export default function Testing() {
  const testResults = {
    hardware: [
      {
        component: "IR Sensors (TCRT5000)",
        test: "Crack Detection Accuracy",
        methodology: "Tested with simulated cracks of varying depths (0.5mm to 5mm)",
        result: "Pass",
        metrics: "95.2% detection rate for cracks ≥1mm",
        notes: "False positive rate: 2.1%",
      },
      {
        component: "Ultrasonic Sensors (HC-SR04)",
        test: "Distance Measurement Precision",
        methodology: "100 measurements at fixed distances (10cm, 50cm, 100cm, 200cm)",
        result: "Pass",
        metrics: "Average error: ±1.5mm",
        notes: "Consistent performance across temperature range",
      },
      {
        component: "GPS Module (NEO-6M)",
        test: "Location Accuracy",
        methodology: "Static position test for 24 hours, compared with known coordinates",
        result: "Pass",
        metrics: "CEP accuracy: 2.3m",
        notes: "Stable satellite lock (avg 8-12 satellites)",
      },
      {
        component: "Camera Module (OV5640)",
        test: "Image Quality & Clarity",
        methodology: "Captured images in various lighting conditions (bright, dim, night)",
        result: "Pass",
        metrics: "5MP resolution maintained",
        notes: "IR LEDs effective in low-light conditions",
      },
      {
        component: "Battery & Power System",
        test: "Runtime & Efficiency",
        methodology: "Continuous operation test with all sensors active",
        result: "Pass",
        metrics: "9.2 hours runtime (target: 8-10 hours)",
        notes: "Power consumption: 15W average",
      },
      {
        component: "Motor System",
        test: "Track Navigation",
        methodology: "10km test run on standard gauge tracks",
        result: "Pass",
        metrics: "Maintained 2.3 km/h average speed",
        notes: "No derailments or navigation issues",
      },
    ],
    software: [
      {
        component: "Data Acquisition",
        test: "Sensor Sampling Rate",
        methodology: "Monitored data collection frequency over 1000 samples",
        result: "Pass",
        metrics: "Consistent 10Hz sampling rate",
        notes: "No data loss or buffer overflow",
      },
      {
        component: "Edge Processing",
        test: "Crack Detection Algorithm",
        methodology: "Tested with 500 images (250 with cracks, 250 without)",
        result: "Pass",
        metrics: "Accuracy: 94.8%, Precision: 93.2%, Recall: 96.4%",
        notes: "Processing time: 120ms per image",
      },
      {
        component: "Communication Module",
        test: "Data Transmission Reliability",
        methodology: "1000 MQTT messages sent over 4G LTE",
        result: "Pass",
        metrics: "99.7% delivery rate",
        notes: "Average latency: 180ms",
      },
      {
        component: "Cloud Processing",
        test: "Lambda Function Performance",
        methodology: "Load testing with 100 concurrent requests",
        result: "Pass",
        metrics: "Avg response time: 450ms",
        notes: "Auto-scaling worked as expected",
      },
      {
        component: "Dashboard",
        test: "Real-time Updates",
        methodology: "Simulated 50 defect alerts over 10 minutes",
        result: "Pass",
        metrics: "All alerts displayed within 2 seconds",
        notes: "WebSocket connection stable",
      },
      {
        component: "End-to-End System",
        test: "Full Workflow Test",
        methodology: "Defect detection to alert notification",
        result: "Pass",
        metrics: "Total time: 3.2 seconds average",
        notes: "Includes detection, transmission, processing, and alert",
      },
    ],
    integration: [
      {
        scenario: "Network Failover",
        description: "4G connection lost, system switches to Wi-Fi backup",
        result: "Pass",
        notes: "Automatic failover in <5 seconds, no data loss",
      },
      {
        scenario: "Low Battery",
        description: "Battery drops below 20%, system sends alert and reduces power",
        result: "Pass",
        notes: "Alert sent immediately, non-critical systems disabled",
      },
      {
        scenario: "GPS Signal Loss",
        description: "GPS unable to acquire satellite lock",
        result: "Pass",
        notes: "Uses last known location + dead reckoning",
      },
      {
        scenario: "Cloud Service Interruption",
        description: "AWS temporary outage",
        result: "Pass",
        notes: "Data buffered locally, uploaded when connection restored",
      },
      {
        scenario: "Multiple Concurrent Defects",
        description: "5 cracks detected within 10 meters",
        result: "Pass",
        notes: "All defects logged with accurate coordinates",
      },
    ],
  };

  const fieldTests = [
    {
      location: "Test Track Section A",
      duration: "8 hours",
      distance: "15 km",
      defectsDetected: 12,
      falsePositives: 1,
      missedDefects: 0,
      status: "success",
    },
    {
      location: "Test Track Section B (Curved)",
      duration: "6 hours",
      distance: "10 km",
      defectsDetected: 8,
      falsePositives: 2,
      missedDefects: 1,
      status: "warning",
    },
    {
      location: "Test Track Section C (High Speed)",
      duration: "4 hours",
      distance: "8 km",
      defectsDetected: 5,
      falsePositives: 0,
      missedDefects: 0,
      status: "success",
    },
  ];

  const getStatusColor = (result: string) => {
    if (result === "Pass" || result === "success") return "text-green-600 bg-green-100";
    if (result === "Fail" || result === "error") return "text-red-600 bg-red-100";
    return "text-amber-600 bg-amber-100";
  };

  const getStatusIcon = (result: string) => {
    if (result === "Pass" || result === "success") return CheckCircle;
    if (result === "Fail" || result === "error") return XCircle;
    return AlertCircle;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Testing & Validation</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Comprehensive testing results covering hardware, software, and system integration to ensure reliability and accuracy.
          </p>
        </div>
      </section>

      {/* Testing Summary */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <Target className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">95.2%</div>
              <div className="text-sm text-slate-600">Detection Accuracy</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <Zap className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">33 km</div>
              <div className="text-sm text-slate-600">Total Test Distance</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <CheckCircle className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">18/18</div>
              <div className="text-sm text-slate-600">Tests Passed</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <TrendingUp className="w-10 h-10 text-amber-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">99.7%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-8">Hardware Testing</h2>
          
          <div className="space-y-4">
            {testResults.hardware.map((test, index) => {
              const StatusIcon = getStatusIcon(test.result);
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">{test.component}</h3>
                      <p className="text-sm text-slate-600">{test.test}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(test.result)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{test.result}</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Methodology</div>
                      <div className="text-sm text-slate-700">{test.methodology}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Metrics</div>
                      <div className="text-sm text-slate-700 font-medium">{test.metrics}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Notes</div>
                      <div className="text-sm text-slate-700">{test.notes}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Software Testing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Software Testing</h2>
          
          <div className="space-y-4">
            {testResults.software.map((test, index) => {
              const StatusIcon = getStatusIcon(test.result);
              return (
                <div key={index} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-1">{test.component}</h3>
                      <p className="text-sm text-slate-600">{test.test}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(test.result)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{test.result}</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Methodology</div>
                      <div className="text-sm text-slate-700">{test.methodology}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Metrics</div>
                      <div className="text-sm text-slate-700 font-medium">{test.metrics}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase mb-1">Notes</div>
                      <div className="text-sm text-slate-700">{test.notes}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Testing */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Integration & Stress Testing</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testResults.integration.map((test, index) => {
              const StatusIcon = getStatusIcon(test.result);
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{test.scenario}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(test.result)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{test.result}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{test.description}</p>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">Result</div>
                    <div className="text-sm text-slate-700">{test.notes}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Field Testing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Field Testing Results</h2>
          
          <div className="space-y-6">
            {fieldTests.map((test, index) => {
              const StatusIcon = getStatusIcon(test.status);
              return (
                <div key={index} className="bg-gradient-to-r from-white to-slate-50 rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-2">{test.location}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>Duration: <span className="font-medium text-slate-900">{test.duration}</span></span>
                        <span>Distance: <span className="font-medium text-slate-900">{test.distance}</span></span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(test.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{test.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{test.defectsDetected}</div>
                      <div className="text-xs text-slate-600 mt-1">Defects Detected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{test.falsePositives}</div>
                      <div className="text-xs text-slate-600 mt-1">False Positives</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{test.missedDefects}</div>
                      <div className="text-xs text-slate-600 mt-1">Missed Defects</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Overall Field Test Summary</h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">25</div>
                <div className="text-blue-100 text-sm">Total Defects Found</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-blue-100 text-sm">False Positives</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1</div>
                <div className="text-blue-100 text-sm">Missed Defects</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">96%</div>
                <div className="text-blue-100 text-sm">Field Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Learned */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Key Findings & Improvements</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-lg mb-4 text-green-400">Strengths</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Excellent detection accuracy for cracks ≥1mm depth</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Reliable communication with 99.7% message delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Robust failover mechanisms for network interruptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Battery life exceeds target specifications</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-lg mb-4 text-amber-400">Areas for Improvement</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Performance degrades on curved tracks - needs algorithm tuning</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Occasional false positives from rust or debris</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>GPS accuracy could be improved with RTK correction</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Image quality in extreme lighting conditions needs enhancement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
