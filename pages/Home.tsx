import React from 'react';
import { ScrollReveal } from '../components/Layout';
import { Star, MapPin, ShieldCheck, Zap, Heart, Anchor, Palette, PenTool } from 'lucide-react';
import { Logo } from '../components/Logo';
import { ARTISTS } from '../constants';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="bg-brand-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-dark">
        {/* Mesh Gradient Layer */}
        <div className="mesh-gradient mesh-animate"></div>
        
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=1920&h=1080&grayscale&blur=2" 
            alt="Tattoo Studio Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-transparent to-brand-dark"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="mb-12">
              <Logo className="w-48 md:w-64 mx-auto mb-8 drop-shadow-[0_0_50px_rgba(0,242,255,0.6)] animate-pulse" />
            </div>
            
            <h1 className="text-7xl md:text-[12rem] font-black text-white mb-8 tracking-tighter leading-none italic uppercase">
              HUSTLE <span className="text-brand-teal text-glow-blue">INK</span>
            </h1>
            
            <div className="glass-card inline-block px-8 py-3 rounded-full mb-12 border-white/20">
              <p className="text-lg md:text-xl text-zinc-300 font-black uppercase tracking-[0.5em]">
                Premium <span className="text-brand-teal">Tattoo</span> Studio
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/ai-generator" className="glass-cta px-16 py-6 text-brand-teal font-black rounded-full transition-all uppercase tracking-[0.2em] text-sm flex items-center gap-3 group">
                <Zap size={20} className="group-hover:animate-bounce" />
                AI Tasarımcıyı Başlat
              </Link>
              <a href="#location" className="px-16 py-6 glass-card text-white font-black rounded-full hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-sm border-white/10">
                Randevu Al
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-1 h-16 bg-gradient-to-b from-brand-teal to-transparent rounded-full opacity-50"></div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 px-4 md:px-8 max-w-7xl mx-auto border-y border-white/5">
        <div className="text-center mb-24">
          <ScrollReveal direction="up">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter italic">Vibe & Vision</h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-brand-teal to-brand-purple mx-auto rounded-full"></div>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-24 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-12">
              <div className="group">
                <h3 className="text-3xl font-black text-brand-teal mb-4 flex items-center gap-4 italic">
                  <Palette className="text-brand-purple" /> Sanatın Ruhu
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                  Hustle Ink, sadece bir dövme stüdyosu değil; yaratıcılığın, sokağın dili ve mürekkebin kalıcılığının birleştiği bir merkez. Her çizgi bir hikaye, her dövme bir imzadır.
                </p>
              </div>

              <div className="group">
                <h3 className="text-3xl font-black text-brand-teal mb-4 flex items-center gap-4 italic">
                  <ShieldCheck className="text-brand-purple" /> Laboratuvar Titizliği
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                  Underground ruhu, kurumsal hijyen standartlarıyla birleştiriyoruz. En modern sterilizasyon teknikleri ve dünya markası boyalarla sağlığınızı sanatımızın önüne koyuyoruz.
                </p>
              </div>

              <div className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:bg-white/5 transition-all">
                <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <PenTool size={120} className="text-brand-teal" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-widest">Hustle Culture</h3>
                <p className="text-zinc-500 leading-relaxed font-semibold">
                  Beşiktaş'ın kalbinde başlayan bu hikaye; dövme sanatı, lifestyle moda ve sokak kültürünü tek bir çatı altında topluyor. Bizimle her anın bir "Hustle".
                </p>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="right" delay={200}>
            <div className="relative">
              <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl glass-border group">
                <img 
                  src="https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=1000&grayscale" 
                  alt="Artist Vibe" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/20 to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl">
                  <p className="text-brand-teal font-black text-xl italic">"True art doesn't beg for attention."</p>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 hidden lg:grid grid-cols-1 gap-4">
                <div className="bg-brand-purple p-6 rounded-2xl rotate-3 shadow-xl neon-glow-purple">
                    <Heart className="text-white mb-1" />
                    <span className="text-2xl font-black text-white">99%</span>
                    <p className="text-white/70 text-[10px] font-black uppercase">Vibe Match</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Artists */}
      <section className="py-32 bg-white/[0.02] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter">ELITE SQUAD</h2>
              <div className="flex items-center justify-center gap-3 text-brand-purple mb-4">
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-[0.3em]">Masters of the Needle</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12">
            {ARTISTS.map((artist, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 150}>
                <div className="group relative rounded-3xl overflow-hidden glass-card hover:border-brand-teal/40 transition-all duration-500">
                  <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img 
                      src={artist.img} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-black text-white mb-1 italic">{artist.name}</h3>
                    <p className="text-brand-teal text-sm font-black uppercase tracking-widest">{artist.role}</p>
                    <div className="h-1 w-0 group-hover:w-full bg-brand-teal transition-all duration-500 mt-4"></div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left">
             <div className="h-[500px] w-full rounded-[40px] overflow-hidden glass-card relative shadow-3xl">
               <img 
                src="https://images.unsplash.com/photo-1524666041070-9d87656c25bb?auto=format&fit=crop&q=80&w=1200&grayscale"
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                alt="Studio Exterior"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/10 to-transparent"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-full border border-brand-teal/30 shadow-[0_0_50px_rgba(0,242,255,0.2)]">
                    <MapPin className="text-brand-teal w-12 h-12 animate-bounce" />
                  </div>
               </div>
             </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <h2 className="text-5xl font-black text-white mb-10 italic uppercase">Base Camp</h2>
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="bg-brand-teal/10 p-4 rounded-2xl glass-border">
                    <MapPin className="text-brand-teal w-8 h-8 flex-shrink-0" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">Beşiktaş HQ</h3>
                  <p className="text-zinc-400 mt-4 leading-relaxed font-medium">
                    Sinanpaşa Mah. Şair Nedim Cad.<br/>
                    No: 15/B, Master Tower<br/>
                    Beşiktaş, İstanbul
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-10 rounded-3xl border-l-8 border-brand-teal">
                <h4 className="text-white font-black mb-6 uppercase tracking-widest text-lg">Hustle Hours</h4>
                <div className="flex justify-between text-zinc-300 font-bold uppercase text-sm mb-3">
                  <span className="text-zinc-500">Pazartesi - Cumartesi</span>
                  <span className="text-brand-teal">10:00 - 20:00</span>
                </div>
                <div className="flex justify-between text-zinc-300 font-bold uppercase text-sm">
                  <span className="text-zinc-500">Pazar</span>
                  <span className="text-brand-purple">Creative Break</span>
                </div>
              </div>

              <Link to="/booking" className="block w-full py-6 bg-brand-teal text-brand-dark text-center font-black rounded-2xl hover:bg-brand-purple transition-all uppercase tracking-[0.2em] text-lg shadow-2xl shadow-brand-teal/10 active:scale-95">
                Randevu Al / Book Now
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};