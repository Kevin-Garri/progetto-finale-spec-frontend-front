import {
  FaDiscord,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTwitch,
  FaGift,
  FaNewspaper,
  FaGlobe,
  FaLanguage,
  FaEuroSign
} from "react-icons/fa";

// Footer component
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 px-4">
      {/* Top section: Trustpilot, Links, Social */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 border-b border-gray-700 pb-8">

        {/* Trustpilot rating */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500 text-xl">★</span>
            <span className="font-semibold">Trustpilot</span>
          </div>
          <div className="flex gap-1 mb-1">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="bg-green-500 text-white rounded px-2 py-1 text-lg"
              >
                ★
              </span>
            ))}
            <span className="bg-gray-300 text-white rounded px-2 py-1 text-lg">
              ★
            </span>
          </div>
          <div className="text-xs text-gray-400">
            TrustScore 4.7 | 63,136 reviews
          </div>
        </div>

        {/* Useful links and features */}
        <div className="flex flex-col gap-2 text-sm">
          <a href="#" className="hover:text-white">
            Terms of Use
          </a>
          <a href="#" className="hover:text-white">
            Privacy policy
          </a>
          <a href="#" className="hover:text-white">
            Affiliation Program
          </a>
          <a href="#" className="hover:text-white">
            Contact us
          </a>
          {/* Discord Bot */}
          <div className="flex items-center gap-2 mt-2">
            <FaDiscord className="text-orange-400" />
            <span>Our Discord Bot</span>
          </div>
          {/* Gift Card */}
          <div className="flex items-center gap-2">
            <FaGift className="text-orange-400" />
            <span>Redeem a Gift Card</span>
          </div>
          {/* News */}
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-orange-400" />
            <span>Find the latest video game news</span>
          </div>
        </div>

        {/* Social icons & App badges */}
        <div className="flex flex-col items-center gap-4">

          {/* Social media icons */}
          {/* Social media icons */}
          <div className="flex gap-4 text-2xl">
            {/* Discord */}
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord className="hover:text-white cursor-pointer" />
            </a>
            {/* Twitter */}
            <a
              href="https://x.com/i/flow/login"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="hover:text-white cursor-pointer" />
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-white cursor-pointer" />
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="hover:text-white cursor-pointer" />
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube className="hover:text-white cursor-pointer" />
            </a>
            {/* Twitch */}
            <a
              href="https://twitch.tv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitch"
            >
              <FaTwitch className="hover:text-white cursor-pointer" />
            </a>
          </div>
          {/* App Store & Google Play badges */}
          <div className="flex gap-2 mt-4">
            <a
              href="https://apps.apple.com/app/apple-store/id375380948"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10"
                style={{ cursor: "pointer" }}
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10"
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom section: Copyright & Locale */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-6 text-xs text-gray-400 gap-4">
        <div>
          Copyright © 2025 Instant Gaming - All rights reserved
        </div>
        <div className="flex items-center gap-6">
          {/* Country */}
          <div className="flex items-center gap-1">
            <FaGlobe />
            <span>Italy</span>
          </div>
          {/* Language */}
          <div className="flex items-center gap-1">
            <FaLanguage />
            <span>English</span>
          </div>
          {/* Currency */}
          <div className="flex items-center gap-1">
            <FaEuroSign />
            <span>EUR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}