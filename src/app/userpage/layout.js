"use client";

import Footer from "../../components/Footer";
// import Navbar from "/components/NavBar";

import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";

export default function UserPageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      <Footer/>

      {/* <Footer /> */}
    </div>
  );
}
