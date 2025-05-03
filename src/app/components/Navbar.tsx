// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/papers", label: "Papers" },
    { href: "/projects", label: "Resume" },
  ];

  return (
    <nav className="absolute top-4 left-1/2 transform -translate-x-1/2 glass backdrop-blur-xs shadow-glass z-20 px-6 py-3">
      <ul className="flex space-x-8">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`
                  text-white font-medium transition
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