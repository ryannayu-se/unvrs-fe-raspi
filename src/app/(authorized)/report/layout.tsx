import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

import Sidebar from "@/components/sidebar";

const listMenu = [
  { name: 'Devices', href: '/config/devices', current: false },
  { name: 'Address Devices', href: '/config/addressDevices', current: false },
  { name: 'Address Variables', href: '/config/addressVariables', current: false },
]

export const metadata: Metadata = {
  title: "Report",
  description: "Universe In One",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-flow-col auto-cols-max">
      {/* <div>
        <Sidebar props={listMenu}/>
      </div> */}
      <div>
        {children}
      </div>
    </div>
  );
}
