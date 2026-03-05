"use client";

import { useState, useEffect, useRef } from "react";

//Types
interface User {
  name: string;
  email?: string;
  avatar?: string;
  cartCount?: number;
}

interface SectionRefs {
  homeRef: React.RefObject<HTMLElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
  servicesRef: React.RefObject<HTMLElement | null>;
  galleryRef: React.RefObject<HTMLElement | null>;
  testimonialsRef: React.RefObject<HTMLElement | null>;
  contactRef: React.RefObject<HTMLElement | null>;
}

interface NavbarProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (ref: React.RefObject<HTMLElement | null>) => void;
  refs: SectionRefs;
  user?: User | null;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onSignOut?: () => void;
  onCartClick?: () => void;
  onProfileClick?: () => void;
}

//Nav Links
const NAV_LINKS = [
  { label: "Home",        refKey: "homeRef"         },
  { label: "About",       refKey: "aboutRef"        },
  { label: "Service",     refKey: "servicesRef"     },
  { label: "Gallery",     refKey: "galleryRef"      },
  { label: "Testimonial", refKey: "testimonialsRef" },
  { label: "Contact",     refKey: "contactRef"      },
] as const;

type RefKey = typeof NAV_LINKS[number]["refKey"];

//Icons
const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
    <span className={`block h-[2px] w-5 rounded-full bg-zinc-700 transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
    <span className={`block h-[2px] rounded-full bg-zinc-700 transition-all duration-300 ${open ? "w-0 opacity-0" : "w-5 opacity-100"}`} />
    <span className={`block h-[2px] w-5 rounded-full bg-zinc-700 transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
  </div>
);

const CartIcon = ({ count = 0 }: { count?: number }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.847-7.148a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
        {count > 9 ? "9+" : count}
      </span>
    )}
  </div>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const SignOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

//Logo
const Logo = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="group flex items-center gap-2.5 outline-none">
    <div className="flex h-8 w-8 md:h-10  md:w-12 items-center justify-center overflow-hidden">
      <img
        src="/logo.jpg"
        alt="PetCare Logo"
        className="h-full w-full object-cover"
      />
    </div>
    <span className="text-[15px] font-semibold tracking-tight text-zinc-800">
      PetCare<span className="text-zinc-800">.</span>
    </span>
  </button>
);

//Avatar
const Avatar = ({ user, size = "md" }: { user: User; size?: "sm" | "md" }) => {
  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const sizeClass = size === "sm" ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs";
  return user.avatar ? (
    <img src={user.avatar} alt={user.name} className={`${sizeClass} rounded-full object-cover`} />
  ) : (
    <div className={`${sizeClass} flex items-center justify-center rounded-full bg-zinc-800 font-semibold text-white shrink-0`}>
      {initials}
    </div>
  );
};

//Main Component
export default function Navbar({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
  refs,
  user = null,
  onSignIn,
  onSignOut,
  onSignUp,
  onCartClick,
  onProfileClick,
}: NavbarProps) {

  const [activeSection, setActiveSection]   = useState<RefKey>("homeRef");
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const dropdownRef                         = useRef<HTMLDivElement>(null);

  //Close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_LINKS.forEach(({ refKey }) => {
      const el = refs[refKey]?.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(refKey); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [refs]);

  const handleNav = (refKey: RefKey) => {
    scrollToSection(refs[refKey]);
    setActiveSection(refKey);
    setMobileMenuOpen(false);
  };

  const isActive = (refKey: RefKey) => activeSection === refKey;

  return (
    <div>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-white shadow-sm`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Logo onClick={() => handleNav("homeRef")} />

          {/*Desktop Nav*/}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ label, refKey }) => {
              const active = isActive(refKey);
              return (
                <button key={refKey} onClick={() => handleNav(refKey)}
                  className={`relative px-3 py-2 text-[14px] font-medium rounded-lg outline-none transition-all duration-200
                    ${active ? "text-zinc-800" : "text-zinc-500 hover:text-zinc-800"}`}>
                  {label}
                  <span className={`absolute left-0 -bottom-1 h-0.5 w-full bg-btn origin-left transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
                </button>
              );
            })}
          </nav>

          {/*Desktop Right*/}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                {/* Cart */} 
                <button onClick={onCartClick} className="relative p-2 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors outline-none">
                  <CartIcon count={user.cartCount} />
                </button>

                {/*Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="rounded-full transition-all outline-none"
                  >
                    <Avatar user={user} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/60 overflow-hidden
                    transition-all duration-200 origin-top-right
                    ${dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}>

                    {/* User info */}
                    <div className="px-4 py-3.5 border-b border-zinc-100">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-zinc-800 truncate">{user.name}</p>
                          {user.email && <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <button
                        onClick={() => { onProfileClick?.(); setDropdownOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors outline-none"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                          <ProfileIcon />
                        </span>
                        My Profile
                      </button>
                    </div>

                    <div className="border-t border-zinc-100 p-1.5">
                      <button
                        onClick={() => { onSignOut?.(); setDropdownOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-rose-500 hover:bg-rose-50 transition-colors outline-none"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-400">
                          <SignOutIcon />
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button onClick={onSignIn}
                  className="px-4 py-2 text-[14px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors outline-none rounded-lg">
                  Sign In
                </button>
                <button onClick={onSignUp}
                  className="rounded-xl bg-zinc-700 px-4 py-2 text-[14px] text-white transition-all duration-200 hover:scale-[1.02] active:scale-95 outline-none">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/*Mobile*/}
          <div className="flex items-center gap-1 lg:hidden">
            {user && (
              <button onClick={onCartClick}
                className="flex h-9 w-9 items-center justify-center text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors outline-none">
                <CartIcon count={user.cartCount} />
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center text-zinc-600 outline-none"
              aria-label="Toggle menu">
              <HamburgerIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>

        {/*Mobile Dropdown*/}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="border-t border-zinc-100 bg-white px-4 pb-5 pt-3 shadow-lg">

            {/*User*/}
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3 border border-zinc-100">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-zinc-800 truncate">{user.name}</p>
                  {user.email && <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>}
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col gap-1 mb-3">
              {NAV_LINKS.map(({ label, refKey }) => {
                const active = isActive(refKey);
                return (
                  <button key={refKey} onClick={() => handleNav(refKey)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13.5px] font-medium text-left transition-all duration-150 outline-none
                      ${active ? "text-zinc-800" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"}`}>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-btn shrink-0" />}
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="my-3 h-px bg-zinc-100" />

            {/* Auth*/}
            {user ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { onProfileClick?.(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-800 outline-none"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 shrink-0">
                    <ProfileIcon />
                  </span>
                  My Profile
                </button>
                <button
                  onClick={() => { onSignOut?.(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-[13.5px] text-rose-500 transition-colors hover:bg-rose-50 outline-none"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-400 shrink-0">
                    <SignOutIcon />
                  </span>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => { onSignIn?.(); setMobileMenuOpen(false); }}
                  className="w-full rounded-xl border border-zinc-200 py-2.5 text-[14px] font-medium text-zinc-600 outline-none hover:text-zinc-900 hover:bg-zinc-50 transition-all duration-200">
                  Sign In
                </button>
                <button onClick={() => { onSignUp?.(); setMobileMenuOpen(false); }}
                  className="w-full rounded-xl bg-btn py-2.5 text-[14px] text-white transition-all hover:scale-[1.01] active:scale-95 duration-300 outline-none">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}