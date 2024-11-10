"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// import { Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";

const NavBar = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const MenuItems = [
    { title: "Home", link: "/" },
    { title: "Marketplace", link: "/marketplace" },
  ];

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Persist dark mode preference in localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav className="fixed w-full z-20 bg-white shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mx-auto px-4 md:px-8 py-1">
        {/* Logo */}
        <Link href="/" scroll={true}>
          <div className="text-xl font-bold text-black">FarmNest</div>
        </Link>

        {/* Desktop Menu and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          {MenuItems.map((menu) => (
            <Link key={menu.link} href={menu.link}>
              <button
                className={`text-sm text-black hover:text-gray-600 ${
                  path === menu.link ? "font-medium" : ""
                }`}
              >
                {menu.title}
              </button>
            </Link>
          ))}
          <Link href="/profile">
            <Image
              src="/profile-photo.png"
              alt="Profile"
              width={20}
              height={20}
              className={`cursor-pointer hover:opacity-80 ${
                path === '/profile' ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </Link>
          {/* <Link href="/login">
            <button className="text-sm text-black hover:text-gray-600">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-sm bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Sign Up
            </button>
          </Link> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Menu Toggle Button */}
          <button onClick={toggleMenu} aria-label="Toggle menu">
            <Image
              src={isMenuOpen ? "/cross2.png" : "/three.png"}
              alt="Menu icon"
              height={25}
              width={30}
              className="object-contain"
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white w-full fixed top-[53px] left-0 shadow-md transition-all duration-300 ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col space-y-4 py-4 px-6">
          {MenuItems.map((menu) => (
            <Link key={menu.link} href={menu.link}>
              <button
                onClick={toggleMenu}
                className={`text-sm text-black hover:text-gray-600 text-right ${
                  path === menu.link ? "font-medium" : ""
                }`}
              >
                {menu.title}
              </button>
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Link href="/login">
              <button
                onClick={toggleMenu}
                className="w-full text-sm text-black hover:text-gray-600 py-2 text-center"
              >
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button
                onClick={toggleMenu}
                className="w-full text-sm bg-black text-white py-2 rounded-md hover:bg-gray-800 mt-2 text-center"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
