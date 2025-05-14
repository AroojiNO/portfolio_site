// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/resume", label: "resume" },
    { href: "/papers", label: "papers" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 glass backdrop-blur-xs shadow-glass z-20 px-6 py-3">
      <ul className="flex space-x-8">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`
                  text-white font-medium transition text-md text-center text-primary
                  ${isActive ? "font-bold" : "hover:font-semibold"}
                  ${isActive ? "border-b-2 border-accent" : "hover:border-b-2"}
                  ${isActive ? "border-accent" : "hover:border-accent/80"}
                  ${isActive ? "text-accent" : "hover:text-accent/80"}
                `}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}