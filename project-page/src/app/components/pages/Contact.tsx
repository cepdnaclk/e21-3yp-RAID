import { Mail, Phone, MapPin, Send, Github, Linkedin, MessageSquare } from "lucide-react";
import { Link } from "react-router";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Have questions about RailGuard? Want to collaborate or learn more? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Inquiry about RailGuard"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>

              <p className="text-sm text-slate-500 mt-4">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 mb-1">Email</div>
                      <a href="mailto:info@railguard.project" className="text-blue-600 hover:text-blue-700">
                        info@railguard.project
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 mb-1">Phone</div>
                      <a href="tel:+1234567890" className="text-slate-600 hover:text-slate-900">
                        +1 (234) 567-8900
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 mb-1">Location</div>
                      <p className="text-slate-600">
                        University/College Name<br />
                        Department of Engineering<br />
                        City, State, Country
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="font-medium text-slate-900 mb-4">Connect with us</div>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Github className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Linkedin className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Mail className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-900">Quick Answers</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Is the project open source?</h4>
                    <p className="text-sm text-slate-600">
                      Selected components are open source. Full documentation is available upon request for educational purposes.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Can this be deployed commercially?</h4>
                    <p className="text-sm text-slate-600">
                      This is currently a proof-of-concept. Commercial deployment would require additional certifications and testing.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Are you available for collaborations?</h4>
                    <p className="text-sm text-slate-600">
                      Yes! We're open to collaborations with academic institutions and industry partners. Get in touch to discuss opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Work */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Future Roadmap</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Enhanced AI Detection</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Deep learning models for crack classification</li>
                <li>• Predictive maintenance algorithms</li>
                <li>• Improved accuracy in varied conditions</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200 p-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Fleet Management</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Multi-robot coordination</li>
                <li>• Centralized fleet monitoring</li>
                <li>• Automated scheduling system</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Advanced Sensors</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Thermal imaging cameras</li>
                <li>• Ground-penetrating radar</li>
                <li>• Vibration analysis sensors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Interested in Learning More?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Explore our detailed technical documentation, specifications, and testing results throughout the site.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/specifications"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Specifications
            </Link>
            <Link
              to="/architecture"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              See Architecture
            </Link>
            <Link
              to="/team"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
