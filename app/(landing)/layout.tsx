import React from "react";

// import Navbar from "@/components/navbar";
// import Sidebar from "@/components/sidebar";

// import { checkSubscription } from "@/lib/subscription";
import HomeNavbar from "./homenavbar";

export default async function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
//   const isPro = await checkSubscription();

  return (
    <div className="h-full">
      <HomeNavbar/>
      {/* <Navbar isPro={isPro} />
      <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} />
      </div> */}
      <main className="md:pl-20 pt-16 h-full">{children}</main>
    </div>
  );
}
