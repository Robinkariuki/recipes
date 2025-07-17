'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import NextNProgress from 'nextjs-progressbar';
import Navbar from '../_components/navabar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />

      {/* Progress bar configured */}
      <NextNProgress
        color="#EB1260"     // your preferred color
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-4"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
