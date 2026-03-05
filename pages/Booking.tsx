import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '../components/Layout';
import { ARTISTS, TIME_SLOTS } from '../constants';
import { Artist, Appointment } from '../types';
import { format, addDays, isSameDay, startOfToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { createAppointment, getArtistAppointmentsOnDate } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Booking: React.FC = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    notes: ''
  });

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    if (selectedArtist && selectedDate) {
      const fetchBookedSlots = async () => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const appointments = await getArtistAppointmentsOnDate(selectedArtist.id, dateStr);
        setBookedSlots(appointments.map(a => a.timeSlot));
      };
      fetchBookedSlots();
    }
  }, [selectedArtist, selectedDate]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtist || !selectedTime) return;

    setLoading(true);
    try {
      const appointment: Appointment = {
        artistId: selectedArtist.id,
        artistName: selectedArtist.name,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        status: 'pending',
        notes: formData.notes,
        createdAt: Date.now()
      };

      await createAppointment(appointment);
      setSuccess(true);
      setStep(4);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="max-w-md w-full bg-brand-navy p-10 rounded-[40px] border border-brand-teal/20 text-center shadow-2xl">
          <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="text-brand-teal w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white brand-font mb-4 uppercase italic">Randevu Talebi Alındı!</h2>
          <p className="text-zinc-400 mb-8 font-medium">
            Randevu talebiniz başarıyla iletildi. Sanatçımız müsaitlik durumunu kontrol edip size en kısa sürede onay e-postası gönderecektir.
          </p>
          <div className="bg-brand-dark/50 p-6 rounded-2xl border border-brand-teal/10 text-left mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-xs font-black uppercase">Sanatçı</span>
              <span className="text-brand-teal text-xs font-black uppercase">{selectedArtist?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-zinc-500 text-xs font-black uppercase">Tarih</span>
              <span className="text-white text-xs font-black uppercase">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 text-xs font-black uppercase">Saat</span>
              <span className="text-white text-xs font-black uppercase">{selectedTime}</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-brand-teal text-brand-dark font-black rounded-xl hover:bg-brand-orange transition-all uppercase tracking-widest"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 brand-font italic uppercase tracking-tighter">
              Randevu <span className="text-brand-teal">Al</span>
            </h1>
            <p className="text-zinc-500 font-black uppercase tracking-[0.2em]">Sanatını Ölümsüzleştir</p>
          </div>
        </ScrollReveal>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0"></div>
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black z-10 transition-all duration-500 border-2",
                step >= s ? "bg-brand-teal border-brand-teal text-brand-dark" : "bg-brand-dark border-zinc-800 text-zinc-500"
              )}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="bg-brand-navy/30 rounded-[40px] border border-brand-teal/10 overflow-hidden backdrop-blur-sm shadow-2xl">
          {/* Step 1: Artist Selection */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-black text-white brand-font mb-8 uppercase italic flex items-center gap-3">
                <User className="text-brand-teal" /> Sanatçı Seçimi
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {ARTISTS.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => { setSelectedArtist(artist); setStep(2); }}
                    className={cn(
                      "group relative rounded-3xl overflow-hidden border-2 transition-all duration-300 text-left",
                      selectedArtist?.id === artist.id ? "border-brand-teal bg-brand-teal/5" : "border-transparent bg-brand-navy hover:border-brand-teal/30"
                    )}
                  >
                    <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-black brand-font text-lg">{artist.name}</h3>
                      <p className="text-brand-teal text-xs font-black uppercase tracking-widest">{artist.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white brand-font uppercase italic flex items-center gap-3">
                  <CalendarIcon className="text-brand-teal" /> Tarih ve Saat
                </h2>
                <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white text-xs font-black uppercase flex items-center gap-1">
                  <ChevronLeft size={14} /> Geri
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Calendar */}
                <div>
                  <label className="block text-zinc-500 text-xs font-black uppercase mb-4 tracking-widest">Tarih Seçin</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {dates.map((date) => (
                      <button
                        key={date.toISOString()}
                        onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                          isSameDay(selectedDate, date) 
                            ? "bg-brand-teal border-brand-teal text-brand-dark" 
                            : "bg-brand-dark border-zinc-800 text-zinc-400 hover:border-brand-teal/50"
                        )}
                      >
                        <span className="text-[10px] font-black uppercase">{format(date, 'EEE', { locale: tr })}</span>
                        <span className="text-lg font-black">{format(date, 'd')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-zinc-500 text-xs font-black uppercase mb-4 tracking-widest">Saat Seçin</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            "py-3 rounded-xl border font-black text-sm transition-all",
                            isBooked ? "bg-zinc-900 border-zinc-900 text-zinc-700 cursor-not-allowed line-through" :
                            selectedTime === slot 
                              ? "bg-brand-orange border-brand-orange text-brand-dark" 
                              : "bg-brand-dark border-zinc-800 text-zinc-400 hover:border-brand-orange/50"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {selectedTime && (
                    <button 
                      onClick={() => setStep(3)}
                      className="w-full mt-8 py-4 bg-brand-teal text-brand-dark font-black rounded-xl hover:bg-brand-orange transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      Devam Et <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Customer Info */}
          {step === 3 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white brand-font uppercase italic flex items-center gap-3">
                  <MessageSquare className="text-brand-teal" /> Bilgilerinizi Girin
                </h2>
                <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white text-xs font-black uppercase flex items-center gap-1">
                  <ChevronLeft size={14} /> Geri
                </button>
              </div>

              <form onSubmit={handleBooking} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-zinc-500 text-xs font-black uppercase mb-2 tracking-widest">Ad Soyad</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal" size={18} />
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-brand-dark border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-teal outline-none transition-all font-bold"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs font-black uppercase mb-2 tracking-widest">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal" size={18} />
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-brand-dark border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-teal outline-none transition-all font-bold"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs font-black uppercase mb-2 tracking-widest">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal" size={18} />
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-brand-dark border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-brand-teal outline-none transition-all font-bold"
                        placeholder="+90 5xx xxx xx xx"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-zinc-500 text-xs font-black uppercase mb-2 tracking-widest">Notlar (Opsiyonel)</label>
                    <textarea 
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-brand-dark border border-zinc-800 rounded-xl p-4 text-white focus:border-brand-teal outline-none transition-all font-bold resize-none"
                      placeholder="Dövme boyutu, bölgesi veya özel istekleriniz..."
                    ></textarea>
                  </div>

                  <div className="bg-brand-teal/5 p-6 rounded-2xl border border-brand-teal/20">
                    <h4 className="text-white font-black text-xs uppercase mb-4 tracking-widest">Randevu Özeti</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-[10px] font-black uppercase">Sanatçı</span>
                        <span className="text-brand-teal text-[10px] font-black uppercase">{selectedArtist?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-[10px] font-black uppercase">Tarih</span>
                        <span className="text-white text-[10px] font-black uppercase">{format(selectedDate, 'd MMMM yyyy', { locale: tr })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 text-[10px] font-black uppercase">Saat</span>
                        <span className="text-white text-[10px] font-black uppercase">{selectedTime}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-teal text-brand-dark font-black rounded-xl hover:bg-brand-orange transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? "İşleniyor..." : "Randevuyu Onayla"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
