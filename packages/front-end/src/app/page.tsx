import clsx from "clsx";
import { Inter } from "@next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <>
      <main className={clsx("w-full h-full", inter.className)}>
        <h1 className="border-b border-neutral-300 px-4 py-2 text-2xl font-medium text-center">
          User Management
        </h1>
        <div className="p-4">
          <p className="text-neutral-500">Hello, world.</p>
        </div>
      </main>
    </>
  );
}
