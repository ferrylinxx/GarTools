import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 rounded-2xl shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                GarTools
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-lg">
              The <span className="font-bold text-white">#1 free platform</span> to process and enhance your media.
              <span className="block mt-2 text-blue-300 font-semibold">Fast • Secure • Always Free</span>
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/f.garola" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zm0 1.5h8.5A4.25 4.25 0 0120.5 7.75v8.5A4.25 4.25 0 0116.25 20.5h-8.5A4.25 4.25 0 013.5 16.25v-8.5A4.25 4.25 0 017.75 3.5zm9.5 2a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
                </svg>
              </a>
              <a href="https://tecnofgb.com/" target="_blank" rel="noopener noreferrer" className="group p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.5 2.5 3.75 5.5 3.75 9S14.5 18.5 12 21m0-18C9.5 5.5 8.25 8.5 8.25 12S9.5 18.5 12 21M3 12h18" />
                </svg>
              </a>
              <a href="mailto:contact@fgarola.es" className="group p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">About</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Terms</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-semibold hover:translate-x-1 inline-block">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-300 font-semibold">
                &copy; {currentYear} <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-black">GarTools</span>. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Made with <span className="text-red-500">❤️</span> for the community
              </p>
            </div>

            {/* Disclaimer */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm max-w-md">
                Please respect copyright laws and platform Terms of Service.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              { icon: '🔒', text: 'Secure' },
              { icon: '⚡', text: 'Fast' },
              { icon: '🆓', text: 'Free Forever' },
              { icon: '🌍', text: '250K+ Users' },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm text-gray-300 font-semibold">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
