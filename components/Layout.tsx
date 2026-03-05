import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Twitter, MapPin, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

const ProfileDropdown: React.FC = () => {
  const { currentUser, logout, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <button 
        onClick={() => signInWithGoogle()}
        className="flex items-center gap-2 bg-brand-teal hover:bg-brand-purple text-brand-dark px-5 py-2 rounded-full font-black transition-all text-sm uppercase tracking-widest shadow-lg shadow-brand-teal/20"
      >
        <User size={16} /> Giriş Yap
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 glass-border px-3 py-1.5 rounded-full transition-all"
      >
        <img 
          src={currentUser.photoURL || "https://ui-avatars.com/api/?name=" + currentUser.displayName} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-brand-teal/50"
        />
        <span className="text-sm font-bold text-zinc-100 hidden md:block">
          {currentUser.displayName?.split(' ')[0]}
        </span>
        <ChevronDown size={14} className={`text-brand-teal transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 glass-card rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
               <img 
                src={currentUser.photoURL || "https://ui-avatars.com/api/?name=" + currentUser.displayName} 
                alt="Profile Large" 
                className="w-12 h-12 rounded-full border-2 border-brand-purple"
              />
              <div>
                <h3 className="text-white font-black text-sm">{currentUser.displayName}</h3>
                <p className="text-zinc-500 text-xs truncate max-w-[150px]">{currentUser.email}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <Link 
              to="/ai-design" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full p-3 text-sm font-bold text-zinc-300 hover:text-brand-teal hover:bg-brand-teal/5 rounded-lg transition-colors"
            >
              <User size={18} /> Kayıtlı Tasarımlarım
            </Link>
            <div className="h-px bg-zinc-800 my-1"></div>
            <button 
              onClick={() => { logout(); setIsOpen(false); }}
              className="flex items-center gap-3 w-full p-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <LogOut size={18} /> Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Portföy', path: '/portfolio' },
    { name: 'AI Tasarım', path: '/ai-design' },
    { name: 'Randevu', path: '/booking' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-dark/60 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-4 group">
              <Logo className="h-12 w-12 group-hover:rotate-12 transition-transform duration-500" />
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-[0.3em] leading-none group-hover:text-brand-teal transition-colors">
                  HUSTLE <span className="text-brand-purple text-glow-purple">INK</span>
                </span>
                <span className="text-[8px] font-bold text-zinc-500 tracking-[0.5em] uppercase mt-1">Master of Ink</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-brand-teal'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-teal rounded-full shadow-[0_0_10px_rgba(0,242,255,0.5)]"></span>
                  )}
                </Link>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <ProfileDropdown />
          </div>

          <div className="-mr-2 flex md:hidden items-center gap-4">
             <div className="scale-90">
                <ProfileDropdown />
             </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-brand-teal transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-dark/95 border-b border-brand-teal/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 rounded-md text-base font-black uppercase tracking-widest ${
                  isActive(link.path)
                    ? 'text-brand-teal bg-brand-teal/10'
                    : 'text-zinc-300 hover:text-brand-orange'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark border-t border-brand-teal/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Logo className="h-10 w-10" />
            <h2 className="text-2xl font-black brand-font text-white tracking-widest">HUSTLE INK</h2>
          </div>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Beşiktaş, İstanbul | Master of Ink</p>
        </div>
        <div className="flex space-x-8">
          <a href="#" className="text-zinc-400 hover:text-brand-teal hover:-translate-y-1 transition-all"><Instagram size={24} /></a>
          <a href="#" className="text-zinc-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><Twitter size={24} /></a>
          <a href="#" className="text-zinc-400 hover:text-brand-teal hover:-translate-y-1 transition-all"><MapPin size={24} /></a>
        </div>
        <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Hustle Ink. Built for the Culture.
        </div>
      </div>
    </footer>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up';
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 opacity-100';
    
    switch (direction) {
      case 'left': return '-translate-x-10 opacity-0';
      case 'right': return 'translate-x-10 opacity-0';
      case 'up': return 'translate-y-10 opacity-0';
      default: return 'opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getTransform()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};