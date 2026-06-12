"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import "./Navbar.css";

// Page Index for interactive site-wide search
const SITE_PAGES = [
  { name: "Home Page", url: "/", keywords: "home main landing shape future leaders kids youth" },
  { name: "About Us", url: "/about", keywords: "about us story founder alex johnson mission vision values timeline values" },
  { name: "Programs", url: "/programs", keywords: "programs leadership technology career mentorship education innovation" },
  { name: "Volunteer Page", url: "/volunteer", keywords: "volunteer apply community forms join benefits requirements" },
  { name: "Events Calendar", url: "/events", keywords: "events calendar workshops meetings service registrations" },
  { name: "Impact Metrics", url: "/impact", keywords: "impact growth charts stats achievements success stories youth" },
  { name: "Resources & Guides", url: "/resources", keywords: "resources leadership technology career guides download pdf" },
  { name: "Get Involved", url: "/involved", keywords: "get involved sponsor mentor partnership support" },
  { name: "Frequently Asked Questions", url: "/faq", keywords: "faq questions help support details info" },
  { name: "Contact Us", url: "/contact", keywords: "contact email maps phone address support office" },
  { name: "Admin Dashboard", url: "/admin", keywords: "admin dashboard control secure login tables charts status" }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{name: string, url: string}[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [pathname]);

  // Click outside search closes results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sticky scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 1) {
      const filtered = SITE_PAGES.filter(page => 
        page.name.toLowerCase().includes(value.toLowerCase()) ||
        page.keywords.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].url);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`navbar-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container-inner">
        {/* Logo */}
        <Link href="/" className="logo-brand">
          <img src="/logo.jpg" alt="Future Ready Youth Logo" className="logo-img" />
          <span className="logo-text">
            Future Ready <span className="highlight">Youth</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link href="/" className={isActive("/") ? "active-link" : ""}>Home</Link>
          <Link href="/about" className={isActive("/about") ? "active-link" : ""}>About</Link>
          <Link href="/programs" className={isActive("/programs") ? "active-link" : ""}>Programs</Link>
          <Link href="/events" className={isActive("/events") ? "active-link" : ""}>Events</Link>
          <Link href="/impact" className={isActive("/impact") ? "active-link" : ""}>Impact</Link>
          <Link href="/resources" className={isActive("/resources") ? "active-link" : ""}>Resources</Link>
          
          {/* More Dropdown */}
          <div className="nav-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button className={`dropdown-trigger ${(isActive("/involved") || isActive("/faq") || isActive("/contact") || isActive("/admin")) ? "active-link" : ""}`}>
              More <ChevronDown size={14} />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link href="/involved">Get Involved</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/admin" className="admin-menu-link">Admin Dashboard</Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Nav Options */}
        <div className="navbar-actions">
          {/* Search Box */}
          <div className="search-box-wrapper" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input 
                type="text" 
                placeholder="Search site..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-btn" aria-label="Submit Search">
                <Search size={18} />
              </button>
            </form>
            
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, idx) => (
                  <Link 
                    key={idx} 
                    href={result.url} 
                    className="search-result-item"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                  >
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/volunteer" className="btn btn-primary btn-small desktop-cta">
            Volunteer Now
          </Link>

          {/* Mobile Menu Icon */}
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Navigation Menu">
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <nav className="mobile-nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/programs">Programs</Link>
            <Link href="/events">Events</Link>
            <Link href="/impact">Impact</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/involved">Get Involved</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/admin" className="mobile-admin-link">Admin Dashboard</Link>
            <Link href="/volunteer" className="btn btn-primary btn-large" style={{ marginTop: "1rem" }}>
              Volunteer Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
