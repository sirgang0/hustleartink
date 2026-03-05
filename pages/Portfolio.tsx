import React, { useState, useMemo } from 'react';
import { ScrollReveal } from '../components/Layout';
import { TattooItem, BodyPart, TattooStyle } from '../types';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

// Mock Data Generation
const generateMockData = (): TattooItem[] => {
  const items: TattooItem[] = [];
  const styles = Object.values(TattooStyle);
  const parts = Object.values(BodyPart);

  for (let i = 1; i <= 24; i++) {
    items.push({
      id: i,
      imageUrl: `https://picsum.photos/400/400?random=${i + 100}`,
      title: `Dövme #${i}`,
      price: Math.floor(Math.random() * (5000 - 500) + 500),
      bodyPart: parts[Math.floor(Math.random() * parts.length)],
      style: styles[Math.floor(Math.random() * styles.length)]
    });
  }
  return items;
};

const portfolioData = generateMockData();

export const Portfolio: React.FC = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | 'All'>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    let data = portfolioData.filter(item => {
      const matchesBody = selectedBodyPart === 'All' || item.bodyPart === selectedBodyPart;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      return matchesBody && matchesPrice;
    });

    data.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    return data;
  }, [selectedBodyPart, priceRange, sortOrder]);

  return (
    <div className="pt-32 min-h-screen bg-brand-dark px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-12 italic uppercase tracking-tighter">
            Portföy <span className="text-brand-teal text-glow-blue">Gallery</span>
          </h1>
        </ScrollReveal>

        {/* Filters Section */}
        <div className="mb-12">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-white glass-card px-6 py-3 rounded-xl mb-4 font-bold"
          >
            <Filter size={18} /> Filtreler
          </button>

          <div className={`glass-card p-8 rounded-2xl transition-all ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid md:grid-cols-4 gap-8">
              
              {/* Body Part Filter */}
              <div>
                <label className="block text-zinc-500 text-xs font-black uppercase tracking-widest mb-3">Bölge</label>
                <select 
                  className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 focus:border-brand-teal outline-none transition-colors"
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value as BodyPart | 'All')}
                >
                  <option value="All" className="bg-brand-dark">Tümü</option>
                  {Object.values(BodyPart).map(part => (
                    <option key={part} value={part} className="bg-brand-dark">{part}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-zinc-500 text-xs font-black uppercase tracking-widest mb-3">Fiyat Aralığı ({priceRange[0]}₺ - {priceRange[1]}₺)</label>
                <div className="flex gap-2 items-center">
                    <input 
                        type="range" 
                        min="0" 
                        max="6000" 
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-brand-teal h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-zinc-500 text-xs font-black uppercase tracking-widest mb-3">Sıralama</label>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="w-full flex items-center justify-between bg-white/5 text-white border border-white/10 rounded-xl p-3 hover:border-brand-teal transition-colors font-bold"
                >
                  <span>Fiyat: {sortOrder === 'asc' ? 'Artan' : 'Azalan'}</span>
                  {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-end">
                <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">
                  {filteredData.length} sonuç bulundu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredData.map((item) => (
            <ScrollReveal key={item.id} direction="up">
              <div className="group glass-card rounded-2xl overflow-hidden hover:border-brand-teal/50 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md text-brand-teal text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-teal/20">
                    {item.bodyPart}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-black italic">{item.style}</h3>
                    <span className="text-brand-teal font-black">{item.price} ₺</span>
                  </div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Tahmini Fiyat</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Aradığınız kriterlere uygun dövme bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};