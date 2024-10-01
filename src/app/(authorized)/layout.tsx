import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

import Header from "@/components/header";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";

const listMenu = [
  { name: 'Dashboard', href: '/', current: false },
//   { name: 'Trend', href: '/trend', current: false },
//   { name: 'Alarm', href: '/alarm', current: false },
  { name: 'Report', href: '/report', current: false },
  { name: 'Configurator', href: '/config', current: false },
  { name: 'Settings', href: '/settings', current: false },
  { name: 'Logout', href: '/login', current: false },
]

const listAlarm = [
  { alarmTime: '2024-02-01 22:00:11', log: 'Inverter-2 Over Current', status: "OVERCURRENT" },
  { alarmTime: '2024-02-01 22:00:11', log: 'Inverter-2 Over Current', status: "OVERCURRENT" },
  { alarmTime: '2024-02-01 22:00:11', log: 'Inverter-2 Over Current', status: "OVERCURRENT" },
  { alarmTime: '2024-02-01 22:00:11', log: 'Inverter-2 Over Current', status: "OVERCURRENT" },
  { alarmTime: '2024-02-01 22:00:11', log: 'Inverter-2 Over Current', status: "OVERCURRENT" },
]

export const metadata: Metadata = {
  title: "UNVRS App",
  description: "Universe In One",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full min-h-screen flex flex-col">
          <Header menu={listMenu} alarm={listAlarm} />
          <div className="flex flex-1">
            {/* <div className="hidden lg:block w-1/4">
              <Sidebar props={listMenu} />
            </div> */}
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
