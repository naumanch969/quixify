import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React, { ReactNode } from "react";

 
const RootLayout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="h-full mx-auto w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
      <Navbar />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <div className="md:pl-20 pt-16 h-full">{children}</div>
    </div>
  );
};

export default RootLayout;
