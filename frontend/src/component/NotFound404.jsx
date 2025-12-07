import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#071025] to-[#001219] text-white overflow-hidden">
      <title>Page Not Found</title>
      <svg
        className="pointer-events-none absolute -top-24 -left-24 opacity-20 w-96 h-96 transform rotate-12"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <g fill="url(#g1)">
          <circle cx="120" cy="120" r="90" />
          <circle cx="420" cy="240" r="60" />
          <rect x="300" y="360" width="240" height="120" rx="40" />
        </g>
      </svg>

      <main className="relative z-10 max-w-5xl w-full px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 rounded-3xl bg-white/4 backdrop-blur-md p-8 md:p-12 shadow-2xl border border-white/6">
          <div className="shrink-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="w-56 h-56 md:w-72 md:h-72 bg-linear-to-br from-[#06b6d4] to-[#7c3aed] rounded-2xl flex items-center justify-center shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="text-white text-center font-extrabold leading-none select-none"
              >
                <div className="text-6xl md:text-7xl">404</div>
                <div className="text-sm md:text-base mt-1 opacity-90">
                  Page Not Found
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl font-extrabold leading-tight"
            >
              Oops — we can’t find that page.
            </motion.h1>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-sm md:text-base text-white/85"
            >
              The link you followed may be broken, outdated, or the page might
              have moved. Try going back to the home page or contact support if
              the problem persists.
            </motion.p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/", { replace: true })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-[#071025] font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                <ArrowLeft size={16} />
                Go home
              </motion.button>

              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                href="/"
                className="inline-flex items-center px-5 py-3 rounded-lg border border-white/20 text-sm text-white/90 hover:bg-white/5"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/", { replace: true });
                }}
              >
                Browse homepage
              </motion.a>
            </div>

            <div className="mt-8 text-xs text-white/50">
              <div>Or try these helpful pages:</div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href="/help"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/help");
                  }}
                  className="text-white/80 underline underline-offset-2"
                >
                  Help Center
                </a>

                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/contact");
                  }}
                  className="text-white/80 underline underline-offset-2"
                >
                  Contact support
                </a>

                <a
                  href="/status"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/status");
                  }}
                  className="text-white/80 underline underline-offset-2"
                >
                  System status
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Movie Rental — Built with care
        </footer>
      </main>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent via-white/1 to-transparent opacity-5" />
    </div>
  );
};

export default NotFound404;
