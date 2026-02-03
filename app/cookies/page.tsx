export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cookie Policy
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last updated: February 2, 2026
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 space-y-8 animate-slide-up">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Are Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cookies are small text files stored on your device by your browser. We use cookies and similar technologies to keep the site working, measure performance, and support advertising.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookie Categories We Use</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Necessary cookies (always active):</strong> Required for core site functions such as security, basic preferences, and service reliability.
              </li>
              <li>
                <strong>Analytics cookies (optional):</strong> Help us understand traffic and usage trends so we can improve usability and performance.
              </li>
              <li>
                <strong>Advertising cookies (optional):</strong> Used by Google AdSense and partners to serve and measure ads. In EEA/UK/CH, these are managed by consent choices.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Consent Works</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We use a consent banner / CMP to manage analytics and advertising consent. You can accept, reject, or customize choices. If you reject personalized advertising, non-personalized ads may still be shown where permitted.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You can change your preferences at any time through Cookie Settings in the consent banner interface.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Managing Cookies in Your Browser</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You can also manage or delete cookies from your browser settings. Blocking certain cookies may affect site functionality, analytics accuracy, or ad relevance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Some cookies are set by third-party services such as Google Analytics and Google AdSense. These providers process data under their own privacy and cookie policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
