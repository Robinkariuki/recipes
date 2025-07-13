'use client';

import Navbar from "../_components/navabar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="p-4">{children}</main>
      {/* Toast container must be mounted once globally */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
