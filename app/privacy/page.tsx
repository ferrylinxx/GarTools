export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Last updated: February 2, 2026</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 space-y-8 animate-slide-up">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We design the service to minimize data collection while keeping the platform secure, reliable, and useful. This policy explains what data we process, why we process it, and how cookies, analytics, and ads work.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We want to be transparent about what is and is not collected:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">What We DON&apos;T Collect by default (when browsing the site)</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>No mandatory account profile data for basic tool usage</li>
                  <li>No permanent storage of uploaded files by default</li>
                  <li>No payment card data processed directly by our servers</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  This applies unless you contact us, create an account, or subscribe to a paid plan.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">What We May Collect</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Minimal technical logs (timestamp, IP address, user agent, error codes)</li>
                  <li>Aggregated usage and performance metrics</li>
                  <li>Device/browser data needed for compatibility and security</li>
                  <li>Cookie/advertising identifiers used by analytics and ads providers</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact &amp; Support Communications</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              When you use the contact form or email support, we process:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Message content and troubleshooting context</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Purpose: to respond to requests, provide support, troubleshoot issues, and keep communication records.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              EU/EEA legal bases: legitimate interests, consent, and where applicable contractual necessity.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Retention: support communications may be retained for up to 12 months. Access is limited to authorized personnel and trusted email/form providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Files, URLs, and Tool Inputs</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Files, URLs, and tool inputs are processed to provide the requested output and service functionality.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Purpose limitation:</strong> Processing is performed only to deliver the requested result</li>
              <li><strong>No permanent storage by default:</strong> Inputs and outputs are not stored permanently by default</li>
              <li><strong>Temporary retention:</strong> Data may be retained temporarily for up to 24 hours (adjustable for operational reasons)</li>
              <li><strong>Security/debug logs:</strong> Minimal logs may be kept (timestamp, error codes, IP, user agent) to protect and maintain the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies, Ads, and Analytics</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use cookies and similar technologies for three categories:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mb-4">
              <li><strong>Necessary cookies:</strong> Required for core site operation</li>
              <li><strong>Analytics cookies (optional):</strong> Used to measure traffic and improve UX</li>
              <li><strong>Advertising cookies (optional):</strong> Used by Google AdSense and partners to serve and measure ads</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              For users in EEA/UK/CH, consent is managed through a CMP/consent banner. If personalized ads are rejected, non-personalized ads may be shown where legally allowed.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You can manage choices through Cookie Settings in the consent banner and see more details on the Cookie Policy page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Google AdSense</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use Google AdSense to display advertisements. Google and its partners may use cookies to serve and measure ads based on your visits to this and other websites.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Advertising Cookies:</strong> Enable ad delivery, frequency control, and measurement</li>
              <li><strong>Ad Personalization Controls:</strong> Available via Google Ads Settings</li>
              <li><strong>Additional Opt-Out:</strong> Available via industry opt-out tools such as NAI</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Data</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Deliver requested tool outputs</li>
              <li>Respond to support requests</li>
              <li>Maintain security, abuse prevention, and reliability</li>
              <li>Improve product quality using aggregated insights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Sharing</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>We do not sell your personal data.</strong></li>
              <li><strong>We share limited data with service providers (analytics/ads) to operate the site, subject to their policies.</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Use core tools without creating an account</li>
              <li>Control or withdraw cookie consent</li>
              <li>Request information about data we may hold about you</li>
              <li>Request deletion where legally applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For privacy questions, please use the Contact page.
            </p>
          </section>

          <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy Notice
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We don&apos;t store uploaded files. We collect minimal technical data (logs, analytics, ad cookies) to run and improve the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
