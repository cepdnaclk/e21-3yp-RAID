import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Video, Image as ImageIcon, FileText, Download } from "lucide-react";

export default function Gallery() {
  const categories = [
    {
      title: "Hardware Development",
      description: "Photos from the hardware design and assembly process",
      images: [
        {
          url: "https://images.unsplash.com/photo-1677092590812-78e7db4900d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBjaXJjdWl0JTIwYm9hcmQlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NzE4NzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          caption: "Circuit board and sensor integration"
        },
        {
          url: "https://images.unsplash.com/photo-1768323275769-6615e7cfcbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbm9tb3VzJTIwcm9ib3QlMjBzZW5zb3IlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MTg3MzUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          caption: "Autonomous robot assembly"
        }
      ]
    },
    {
      title: "Field Testing",
      description: "Documentation from real-world testing on railway tracks",
      images: [
        {
          url: "https://images.unsplash.com/photo-1653813705905-472ea6eac827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwdHJhY2slMjBpbnNwZWN0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NzM1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          caption: "Testing on railway tracks"
        }
      ]
    },
    {
      title: "Team Collaboration",
      description: "Behind the scenes of project development",
      images: [
        {
          url: "https://images.unsplash.com/photo-1760611656007-f767a8082758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwZW5naW5lZXJzJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzE4NzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          caption: "Team working on the project"
        }
      ]
    }
  ];

  const videos = [
    {
      title: "System Demonstration",
      description: "Full walkthrough of the RailGuard system in action",
      thumbnail: "https://images.unsplash.com/photo-1768323275769-6615e7cfcbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbm9tb3VzJTIwcm9ib3QlMjBzZW5zb3IlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MTg3MzUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "5:32"
    },
    {
      title: "Crack Detection Demo",
      description: "Real-time crack detection and alert system demonstration",
      thumbnail: "https://images.unsplash.com/photo-1653813705905-472ea6eac827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWlsd2F5JTIwdHJhY2slMjBpbnNwZWN0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NzM1Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "3:45"
    },
    {
      title: "Dashboard Overview",
      description: "Tour of the cloud-based monitoring dashboard",
      thumbnail: "https://images.unsplash.com/photo-1677092590812-78e7db4900d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb1QlMjBjaXJjdWl0JTIwYm9hcmQlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NzE4NzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "4:18"
    }
  ];

  const documents = [
    { name: "Project Report (PDF)", size: "2.4 MB", icon: FileText },
    { name: "Technical Documentation", size: "1.8 MB", icon: FileText },
    { name: "System Architecture Diagram", size: "850 KB", icon: ImageIcon },
    { name: "Testing Results", size: "1.2 MB", icon: FileText },
    { name: "User Manual", size: "3.1 MB", icon: FileText },
    { name: "Presentation Slides", size: "5.6 MB", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Gallery & Resources</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Visual documentation, videos, and downloadable resources showcasing the RailGuard project.
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900">Photo Gallery</h2>
          </div>

          <div className="space-y-12">
            {categories.map((category, index) => (
              <div key={index}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h3>
                  <p className="text-slate-600">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-slate-600">{image.caption}</p>
                      </div>
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors"></div>
                    </div>
                  ))}

                  {/* Placeholder cards */}
                  {[...Array(Math.max(0, 3 - category.images.length))].map((_, idx) => (
                    <div
                      key={`placeholder-${idx}`}
                      className="bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 aspect-video flex items-center justify-center"
                    >
                      <div className="text-center text-slate-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">More photos coming soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demonstrations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900">Video Demonstrations</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <div
                key={index}
                className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-slate-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <Video className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Video Note</h3>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Full video demonstrations are available upon request. These videos showcase the complete system operation,
              from hardware assembly to real-time crack detection and cloud dashboard monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Diagrams */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Technical Diagrams</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Circuit Diagram</p>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">System Circuit Diagram</h3>
              <p className="text-sm text-slate-600">Complete wiring diagram showing connections between all components</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Flow Diagram</p>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Data Flow Diagram</h3>
              <p className="text-sm text-slate-600">Visualization of data flow from sensors to cloud dashboard</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Mechanical Design</p>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Mechanical Design</h3>
              <p className="text-sm text-slate-600">3D model and dimensions of the robot chassis and components</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">PCB Layout</p>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">PCB Layout Design</h3>
              <p className="text-sm text-slate-600">Custom PCB design for integrating all electronic components</p>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Download className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900">Downloadable Resources</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <button
                  key={index}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-white border border-slate-200 group-hover:border-green-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-slate-600 group-hover:text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate group-hover:text-green-700">{doc.name}</div>
                    <div className="text-sm text-slate-500">{doc.size}</div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-green-600 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="mt-8 bg-slate-900 rounded-xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Request Full Documentation Package</h3>
            <p className="text-slate-300 mb-6">
              Complete project documentation including source code, schematics, and detailed reports are available upon request.
              Please contact us for access to the full documentation package.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Request Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Photos Captured</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Test Runs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">33 km</div>
              <div className="text-blue-100">Track Tested</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8 Months</div>
              <div className="text-blue-100">Development Time</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
