import React, { useState, useRef, useEffect } from 'react';
import { ScrollReveal } from '../components/Layout';
import { VisualOption, Draft } from '../types';
import { refinePrompt, generateTattooDesign } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { saveDraftToFirestore, getUserDrafts, deleteDraftFromFirestore } from '../services/firestoreService';
import { 
  Wand2, Loader2, Download, AlertCircle, 
  Image as ImageIcon, Trash2, Upload, Zap, Palette, Layers, Maximize2, Move, PenTool,
  Anchor, Camera, Wind, Droplets, Triangle, Minus, Square, Smile, Cpu, Info,
  Hand, Pen, Grid, Cloud, Droplet, Pencil, Sparkles,
  BookOpen, Copy, Check
} from 'lucide-react';

const promptExamples = [
  {
    category: 'Realizm',
    prompts: [
      'Göz detaylı aslan portresi, orman yansımaları ile',
      'Antik Yunan heykeli, gerçekçi mermer çatlakları ve sarmaşıklar',
      'Eski bir cep saati, içindeki çarklar ve zamanın akışı'
    ]
  },
  {
    category: 'Old School',
    prompts: [
      'Geleneksel çapa, etrafında kırmızı güller ve denizci düğümü',
      'Kırlangıç figürü, gagasında "Özgürlük" yazılı bir şerit',
      'Hançer saplanmış kalp, klasik Amerikan ekolü renkleri'
    ]
  },
  {
    category: 'Japanese',
    prompts: [
      'Koi balığı, hırçın su dalgaları ve pembe kiraz çiçekleri',
      'Samuray maskesi (Hannya), dumanlar ve ateş motifleri',
      'Ejderha, vücudu saran bulutlar ve altın detaylar'
    ]
  },
  {
    category: 'Geometric',
    prompts: [
      'Geometrik kurt kafası, içinde mandala ve kutsal geometri',
      'Simetrik dağ silüeti, geometrik güneş ve ay döngüsü',
      'Metatron küpü, ince çizgiler ve matematiksel denge'
    ]
  },
  {
    category: 'Minimalist',
    prompts: [
      'Tek çizgi (one-line) kedi silüeti, zarif ve ince',
      'Küçük bir kağıt uçak, arkasında noktalı uçuş izi',
      'Minimalist lavanta dalı, sadece siyah mürekkep'
    ]
  },
  {
    category: 'Trash Polka',
    prompts: [
      'Kurukafa ve saat kolajı, kaotik kırmızı boya sıçramaları',
      'Kuzgun figürü, arkasında tipografik gazete küpürleri',
      'Göz ve pusula kombinasyonu, fırça darbesi efektleri'
    ]
  }
];

const styles: VisualOption[] = [
  { 
    id: 'oldschool', 
    name: 'Old School', 
    imageUrl: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'American traditional, bold black outlines, solid color packing, limited palette (red, green, yellow, blue)',
    description: 'Dövme dünyasının "klasiği" budur. Denizcilerin ve Amerikan ekolünün mirasıdır.',
    features: 'Kalın siyah kontürler, sınırlı renk paleti ve zamansız figürler.',
    commonFigures: 'Çapa, kırlangıç, gül, hançer ve pin-up kızları.'
  },
  { 
    id: 'realism', 
    name: 'Realizm', 
    imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'Hyper-realistic, photorealistic portraiture, smooth transitions, depth and texture, 3D appearance',
    description: 'Fotoğrafın deriye kopyalanmış hali gibidir. Ustalık gerektiren, hata payı en düşük tarzdır.',
    features: 'Derin gölgelendirmeler, ışık oyunları ve 3 boyutlu görünüm.',
    commonFigures: 'Portreler, doğa manzaraları ve hayvanlar.'
  },
  { 
    id: 'japanese', 
    name: 'Japanese', 
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'Traditional Japanese Irezumi, fluid motifs, mythological elements, black background (clouds/waves), vibrant colors',
    description: 'Asırlık bir geleneğin modern temsilcisidir. Genelde vücudun büyük bir bölümünü kaplayacak şekilde tasarlanır.',
    features: 'Akışkan motifler, mitolojik öğeler ve hikaye anlatıcılığı.',
    commonFigures: 'Ejderha, Koi balığı, samuray, Hannya maskesi.'
  },
  { 
    id: 'watercolor', 
    name: 'Watercolor', 
    imageUrl: '/UygulamaTeknigi/suluboya.png.png', 
    promptFragment: 'Watercolor style, soft color bleed, brush strokes, gradient transitions, splash effects, no rigid boundaries',
    description: 'Sanki bir fırça darbesiyle tuvale dokunulmuş, boyalar birbirine karışmış hissi verir.',
    features: 'Belirgin siyah kontürlerin olmaması veya çok ince olması. Renk geçişleri ve sıçrama efektleri.',
    commonFigures: 'Çiçekler, kuşlar ve soyut kompozisyonlar.'
  },
  { 
    id: 'geometric', 
    name: 'Geometric', 
    imageUrl: '/UygulamaTeknigi/geometrik.png.png', 
    promptFragment: 'Geometric patterns, mathematical symmetry, clean sharp lines, circles and sacred geometry forms',
    description: 'Matematiğin sanatla buluştuğu noktadır. Simetri ve denge takıntısı olanlar için idealdir.',
    features: 'Kusursuz düz çizgiler, daireler ve matematiksel formlar.',
    commonFigures: 'Mandalar, kutsal geometri sembolleri ve hayvanların geometrik yorumları.'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    imageUrl: '/UygulamaTeknigi/incecizgi.png.png', 
    promptFragment: 'Minimalist fine line, elegant simplicity, delicate single-needle, subtle silhouettes',
    description: '"Az çoktur" felsefesini savunan, zarif ve ince işçilikli bir tarzdır.',
    features: 'Çok ince iğnelerle yapılan, sade ve gösterişten uzak çizgiler.',
    commonFigures: 'Tek kelimelik yazılar, küçük semboller, ince silüetler.'
  },
  { 
    id: 'blackwork', 
    name: 'Blackwork', 
    imageUrl: '/UygulamaTeknigi/blackwork.png.png', 
    promptFragment: 'Heavy blackwork, solid black ink, high contrast, graphic illustration, dark art aesthetic',
    description: 'Gri tonlamaların olmadığı, sadece saf siyah mürekkebin kullanıldığı çarpıcı bir stildir.',
    features: 'Yüksek kontrast, geniş siyah alanlar ve grafiksel anlatım.',
    commonFigures: 'Karanlık sanat (dark art), illüstrasyonlar ve tamamen siyaha boyanan bölgeler.'
  },
  { 
    id: 'newschool', 
    name: 'New School', 
    imageUrl: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'New school style, cartoonish exaggerations, bright neon colors, graffiti aesthetic',
    description: '90\'ların sonunda popülerleşen, çizgi film ve grafiti estetiğini deriye taşıyan enerjik bir tarzdır.',
    features: 'Abartılı formlar, parlak ve neon renkler, karikatürize edilmiş figürler.',
    commonFigures: 'Zombiler, karikatür karakterleri, fantastik yaratıklar.'
  },
  { 
    id: 'biomechanical', 
    name: 'Biomechanical', 
    imageUrl: 'https://images.unsplash.com/photo-1558478551-1a378f63ad28?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'Biomechanical style, robotic parts, gears, pistons, wires emerging from ripped skin, anatomical fusion',
    description: 'İnsan vücudunun altında bir makine gizliymiş illüzyonunu yaratır.',
    features: 'Derinin yırtılmış gibi göründüğü yerlerden çıkan çarklar, kablolar ve metal parçalar.',
    commonFigures: 'Robotik parçalar, pistonlar ve Alien vari dokular.'
  },
  { 
    id: 'trashpolka', 
    name: 'Trash Polka', 
    imageUrl: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'Trash polka aesthetic, black and red high contrast, collage of realism and typography, chaotic brush strokes',
    description: 'Almanya kökenli bu stil, kaosun içindeki düzeni temsil eder. Modern dövmenin "avangart" çocuğudur.',
    features: 'Sadece siyah ve kırmızı renk kullanılır. Gerçekçi portreler ile tipografi ve fırça darbelerinin kolajı.',
    commonFigures: 'Saatler, kurukafalar, gazete küpürleri ve kaotik çizgiler.'
  }
];

const styleIcons: Record<string, React.ReactNode> = {
  oldschool: <Anchor size={14} />,
  realism: <Camera size={14} />,
  japanese: <Wind size={14} />,
  watercolor: <Droplets size={14} />,
  geometric: <Triangle size={14} />,
  minimalist: <Minus size={14} />,
  blackwork: <Square size={14} />,
  newschool: <Smile size={14} />,
  biomechanical: <Cpu size={14} />,
  trashpolka: <Zap size={14} />
};

const techniques: VisualOption[] = [
  { 
    id: 'handpoked', 
    name: 'Hand-Poked', 
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'hand-poked tattoo, stick and poke, manual needle strikes, organic raw texture, punk aesthetic',
    description: 'Makine kullanmadan, sadece bir iğne ve mürekkep yardımıyla noktasal darbelerle yapılan en ilkel ve organik tekniktir.',
    features: 'Makinelerin o vızıltısı yoktur, daha sessiz ve ritmik bir süreçtir. Ev yapımı veya punk bir estetiği vardır.',
    artisticAspect: 'Her bir noktanın sanatçının eliyle tek tek yerleştirilmesi, işe kişisel bir ruh katar.'
  },
  { 
    id: 'tebori', 
    name: 'Tebori', 
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'traditional Japanese Tebori technique, hand-carved, deep ink saturation, bamboo tool method',
    description: 'Japonya’nın bin yıllık mirasıdır. "Tebori" kelimesi "elle oymak" anlamına gelir.',
    features: 'Makineye göre çok daha derin ve doygun renkler sunar. Ciltte kendine has bir doku bırakır.',
    artisticAspect: 'Bu tekniği icra eden "Horishi" ustaları, çıraklık yıllarını sadece bu ritmi öğrenmek için harcarlar.'
  },
  { 
    id: 'dotwork', 
    name: 'Dotwork', 
    imageUrl: '/UygulamaTeknigi/noktalama.png', 
    promptFragment: 'dotwork stippling, millions of tiny dots, mathematical precision shading, pointillism',
    description: 'Resmin tamamının veya gölgelendirmelerinin milyonlarca küçük noktadan oluştuğu tekniktir.',
    features: 'Uzaktan bakıldığında yumuşak bir geçiş, yakından bakıldığında ise matematiksel bir dizilim görülür.',
    artisticAspect: 'Geometrik dövmelerin ve spiritüel sembollerin vazgeçilmezidir. Sabır sanatıdır.'
  },
  { 
    id: 'whipshading', 
    name: 'Whip Shading', 
    imageUrl: '/UygulamaTeknigi/whipshade.png.png', 
    promptFragment: 'whip shading, pepper shading, fast hand-motion texture, sketch-like strokes',
    description: 'İğnenin deri üzerinde hızlıca "fırlatılması" ile oluşan, noktadan çizgiye doğru açılan bir gölge tekniğidir.',
    features: 'Eskiz defterindeki karakalem taramalarını andırır. Dövmede bir hareket ve doku hissi yaratır.',
    artisticAspect: 'Özellikle "Blackwork" ve "Neo-Traditional" stillerinde dramatik bir derinlik sağlar.'
  },
  { 
    id: 'greywash', 
    name: 'Grey Wash', 
    imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'grey wash shading, diluted black ink, smooth gradients, soft transitions, watercolor-like grey tones',
    description: 'Siyah mürekkebin distile su ile farklı oranlarda seyreltilerek kullanılmasıdır.',
    features: 'Tek bir siyahla, kağıt üzerindeki sulu boya gibi onlarca farklı gri tonu elde edilir.',
    artisticAspect: 'Hiper-realistik portrelerin ve yumuşak geçişli bulutların sırrı bu "yıkama" tekniğindedir.'
  },
  { 
    id: 'singleneedle', 
    name: 'Single Needle', 
    imageUrl: 'https://images.unsplash.com/photo-1562967914-01efa7e87832?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'single needle tattoo, ultra-fine lines, surgical precision, delicate micro-details',
    description: 'Dövme makinesine sadece bir adet mikro ince iğne takılarak yapılan, cerrahi hassasiyet gerektiren bir tekniktir.',
    features: 'Minimalist tasarımlar ve aşırı detaylı küçük figürler için kullanılır.',
    artisticAspect: 'Deri üzerine tükenmez kalemle çizilmiş kadar ince ve zarif durur.'
  },
  { 
    id: 'opaquegray', 
    name: 'Opak Gri', 
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'opaque gray ink, black mixed with white ink, oil painting texture, high coverage grey tones',
    description: 'Grey Wash\'un aksine, siyah mürekkebin suyla değil, beyaz mürekkeple karıştırılmasıdır.',
    features: 'Daha "yağlı boya" hissi veren, kapatıcılığı yüksek gri tonları oluşturur.',
    artisticAspect: 'Derinin kendi rengini tamamen örterek illüstratif bir derinlik sağlar.'
  },
  { 
    id: 'bloodlining', 
    name: 'Kan Çizgisi', 
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'bloodlining technique, temporary red guidelines, no permanent outlines, color-only focus',
    description: 'Sanatçının mürekkep yerine sadece su kullanarak deriyi tahriş etmesi ve geçici bir kırmızı hat oluşturmasıdır.',
    features: 'Kalıcı bir çizgi bırakmaz, sadece sanatçıya rehberlik eder. Dövme bittiğinde bu çizgiler kaybolur.',
    artisticAspect: 'Kontürsüz, sadece renk bloklarından oluşan "Watercolor" dövmelerde mucizeler yaratır.'
  },
  { 
    id: 'colorpacking', 
    name: 'Renk Paketleme', 
    imageUrl: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'solid color packing, high saturation, dense ink application, vibrant long-lasting colors',
    description: 'Mürekkebin deri altına boşluk bırakmadan, en yoğun ve doygun şekilde "hapsedilmesi" tekniğidir.',
    features: 'Renklerin yıllar sonra bile canlı kalmasını sağlar. Küçük dairesel hareketlerle uygulanır.',
    artisticAspect: '"Old School" ve "New School" dövmelerin o patlayan canlılığının arkasındaki güçtür.'
  },
  { 
    id: 'freehand', 
    name: 'Serbest El', 
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&h=300&fit=crop&grayscale', 
    promptFragment: 'freehand tattoo, no stencil, drawn directly on skin, anatomical flow, custom fit',
    description: 'Aslında bir uygulama hazırlığıdır; sanatçı şablon kullanmadan, doğrudan deriye kalemle çizim yapıp dövmeyi işler.',
    features: 'Vücut anatomisine %100 uyum sağlar. Sanatçının özgüvenini temsil eder.',
    artisticAspect: 'Kas yapısına göre kavis alan bir ejderha veya sarmaşık, sadece bu teknikle vücudun bir parçası gibi durabilir.'
  }
];

const techniqueIcons: Record<string, React.ReactNode> = {
  handpoked: <Hand size={14} />,
  tebori: <Pen size={14} />,
  dotwork: <Grid size={14} />,
  whipshading: <Wind size={14} />,
  greywash: <Cloud size={14} />,
  singleneedle: <Minus size={14} />,
  opaquegray: <Layers size={14} />,
  bloodlining: <Droplet size={14} />,
  colorpacking: <Square size={14} />,
  freehand: <Pencil size={14} />
};

const colorSchemes = [
  { id: 'bw', name: 'Siyah & Gri', value: 'monochromatic black and grey shading', class: 'bg-zinc-700' },
  { id: 'full', name: 'Renkli', value: 'vibrant cinematic full color palette', class: 'bg-gradient-to-br from-red-500 via-green-500 to-blue-500' },
  { id: 'trash', name: 'Trash Kırmızı', value: 'strictly black and red high contrast', class: 'bg-gradient-to-r from-black to-red-600' },
  { id: 'neon', name: 'Cyber Neon', value: 'dark with glowing neon accents', class: 'bg-gradient-to-r from-purple-600 to-cyan-400' },
  { id: 'solid', name: 'Tam Siyah', value: 'heavy solid black ink only', class: 'bg-black border border-white/20' }
];

const bodyPlacements = ['Ön Kol', 'Üst Kol', 'Sırt', 'Göğüs', 'Üst Bacak', 'Boyun', 'El'];
const complexityLevels = ['Sade', 'Orta Detay', 'Yüksek Detay', 'Ustalık Eseri'];

export const AIGenerator: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'art' | 'drafts'>('art');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<VisualOption>(styles[0]);
  const [selectedTechnique, setSelectedTechnique] = useState<VisualOption>(techniques[0]);
  const [selectedColor, setSelectedColor] = useState(colorSchemes[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(bodyPlacements[0]);
  const [selectedComplexity, setSelectedComplexity] = useState(complexityLevels[2]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [refinedPromptText, setRefinedPromptText] = useState<string>('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number>(8);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (copiedPrompt) {
      const timer = setTimeout(() => setCopiedPrompt(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPrompt]);

  useEffect(() => {
    if (currentUser) {
      getUserDrafts(currentUser.uid).then(setDrafts);
    }
  }, [currentUser]);

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const refined = await refinePrompt(
        userPrompt, 
        selectedStyle.promptFragment, 
        selectedTechnique.promptFragment, 
        !!referenceImage, 
        similarity,
        selectedColor.value,
        selectedComplexity,
        selectedPlacement
      );
      setRefinedPromptText(refined);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setStep('Mürekkep cilde işleniyor...');
    setError(null);
    try {
      const imageBase64 = await generateTattooDesign(refinedPromptText, referenceImage);
      setGeneratedImage(imageBase64);
      if (currentUser) {
         const newDraft = await saveDraftToFirestore({
           userId: currentUser.uid, imageUrl: imageBase64, prompt: refinedPromptText,
           originalSubject: userPrompt, timestamp: Date.now()
         });
         setDrafts(prev => [newDraft, ...prev]);
      } 
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); setStep(''); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setReferenceImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-dark px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 italic tracking-tighter uppercase">INK ARTIST <span className="text-brand-teal text-glow-blue">AI</span></h1>
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-sm">Hassas Tasarım • Gelişmiş Mürekkep Mantığı • Tam Kontrol</p>
          </div>
        </ScrollReveal>

        <div className="flex justify-center gap-6 mb-20">
          <button onClick={() => setActiveTab('art')} className={`px-12 py-4 rounded-full font-black uppercase tracking-widest transition-all ${activeTab === 'art' ? 'bg-brand-teal text-brand-dark shadow-xl shadow-brand-teal/20' : 'bg-white/5 text-zinc-400 hover:text-brand-teal glass-border'}`}>
            Tasarım Laboratuvarı
          </button>
          <button onClick={() => setActiveTab('drafts')} className={`px-12 py-4 rounded-full font-black uppercase tracking-widest transition-all ${activeTab === 'drafts' ? 'bg-brand-teal text-brand-dark shadow-xl shadow-brand-teal/20' : 'bg-white/5 text-zinc-400 hover:text-brand-teal glass-border'}`}>
            Kayıtlı Şablonlarım ({drafts.length})
          </button>
        </div>

        {activeTab === 'art' && (
          <div className="space-y-16">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Kontroller */}
              <div className="lg:col-span-5 space-y-8">
                {/* Adım 1: Konsept */}
                <div className="glass-card p-10 rounded-[40px] space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-brand-teal text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} /> 1. Konsept Tanımı
                      </label>
                      <button 
                        onClick={() => {
                          const element = document.getElementById('prompt-library');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-[10px] font-black text-zinc-500 hover:text-brand-teal uppercase tracking-widest transition-colors flex items-center gap-1"
                      >
                        <BookOpen size={10} /> Örneklere Bak
                      </button>
                    </div>
                    <textarea 
                      value={userPrompt} 
                      onChange={(e) => setUserPrompt(e.target.value)} 
                      placeholder="Dövme fikrini tarif et... (Örn: Bir gülün içinden çıkan antik pusula)" 
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-brand-teal outline-none text-sm font-bold placeholder:text-zinc-700 resize-none" 
                    />
                  </div>

                <div>
                   <label className="flex items-center gap-2 text-brand-purple text-xs font-black uppercase mb-4 tracking-widest">
                     <ImageIcon size={14} /> 2. Görsel Referans (Opsiyonel)
                   </label>
                   {!referenceImage ? (
                    <div onClick={() => fileInputRef.current?.click()} className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group">
                      <Upload size={24} className="mb-2 text-zinc-600 group-hover:text-brand-teal" />
                      <span className="text-[10px] font-black uppercase text-zinc-600">Referans görselini buraya sürükle</span>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative h-40 w-full bg-brand-dark rounded-xl overflow-hidden group glass-border">
                        <img src={referenceImage} className="w-full h-full object-contain" />
                        <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 p-2 bg-brand-dark/80 rounded-full text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                      </div>
                      <div className="space-y-2 px-2">
                        <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase"><span>Benzerlik</span><span>{similarity}/10</span></div>
                        <input type="range" min="1" max="10" value={similarity} onChange={(e) => setSimilarity(parseInt(e.target.value))} className="w-full accent-brand-teal" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Adım 3: Stiller */}
              <div className="glass-card p-10 rounded-[40px]">
                <label className="block text-brand-teal text-xs font-black uppercase mb-6 tracking-widest">3. Dövme Stilini Seç</label>
                <div className="grid grid-cols-5 gap-3">
                  {styles.map(s => (
                    <button key={s.id} onClick={() => setSelectedStyle(s)} className="group flex flex-col items-center gap-2 outline-none">
                      <div className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all ${selectedStyle.id === s.id ? 'border-brand-teal scale-110 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}>
                        <img src={s.imageUrl} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-brand-dark/80 p-1 rounded-md text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity">
                          {styleIcons[s.id]}
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-tighter text-center truncate w-full ${selectedStyle.id === s.id ? 'text-brand-teal' : 'text-zinc-600'}`}>{s.name}</span>
                    </button>
                  ))}
                </div>

                {/* Stil Detay Kartı */}
                {selectedStyle && (
                  <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-teal/10 rounded-xl text-brand-teal">
                        {styleIcons[selectedStyle.id]}
                      </div>
                      <h4 className="text-white font-black uppercase tracking-widest text-sm">{selectedStyle.name}</h4>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-bold leading-relaxed mb-4 italic">"{selectedStyle.description}"</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="text-brand-teal text-[9px] font-black uppercase tracking-widest shrink-0">Özellikler:</span>
                        <span className="text-zinc-500 text-[9px] font-bold">{selectedStyle.features}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-brand-purple text-[9px] font-black uppercase tracking-widest shrink-0">Figürler:</span>
                        <span className="text-zinc-500 text-[9px] font-bold">{selectedStyle.commonFigures}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Adım 4: Teknikler */}
              <div className="glass-card p-10 rounded-[40px]">
                <label className="block text-brand-purple text-xs font-black uppercase mb-6 tracking-widest flex items-center gap-2">
                  <PenTool size={14} /> 4. Uygulama Tekniği
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {techniques.map(t => (
                    <button key={t.id} onClick={() => setSelectedTechnique(t)} className="group flex flex-col items-center gap-2 outline-none">
                      <div className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all ${selectedTechnique.id === t.id ? 'border-brand-purple scale-110 shadow-[0_0_20px_rgba(188,19,254,0.3)]' : 'border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}>
                        <img src={t.imageUrl} className="w-full h-full object-cover" alt={t.name} />
                        <div className="absolute top-1 right-1 bg-brand-dark/80 p-1 rounded-md text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity">
                          {techniqueIcons[t.id]}
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-tighter text-center truncate w-full ${selectedTechnique.id === t.id ? 'text-brand-purple' : 'text-zinc-600'}`}>{t.name}</span>
                    </button>
                  ))}
                </div>

                {/* Teknik Detay Kartı */}
                {selectedTechnique && (
                  <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-purple/10 rounded-xl text-brand-purple">
                        {techniqueIcons[selectedTechnique.id]}
                      </div>
                      <h4 className="text-white font-black uppercase tracking-widest text-sm">{selectedTechnique.name}</h4>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-bold leading-relaxed mb-4 italic">"{selectedTechnique.description}"</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="text-brand-purple text-[9px] font-black uppercase tracking-widest shrink-0">Özellikler:</span>
                        <span className="text-zinc-500 text-[9px] font-bold">{selectedTechnique.features}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-brand-teal text-[9px] font-black uppercase tracking-widest shrink-0">Sanatsal Yönü:</span>
                        <span className="text-zinc-500 text-[9px] font-bold">{selectedTechnique.artisticAspect}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Adım 5: Gelişmiş Ayarlar */}
              <div className="glass-card p-10 rounded-[40px] space-y-8">
                <div>
                   <label className="flex items-center gap-2 text-brand-teal text-xs font-black uppercase mb-6 tracking-widest"><Palette size={14}/> 5. Mürekkep Paleti</label>
                   <div className="flex flex-wrap gap-3">
                      {colorSchemes.map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => setSelectedColor(c)}
                          className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedColor.id === c.id ? 'bg-brand-teal/10 border-brand-teal text-brand-teal' : 'bg-white/5 border-white/10 text-zinc-500 hover:border-brand-teal/30'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${c.class}`}></div>
                          <span className="text-[10px] font-black uppercase">{c.name}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="flex items-center gap-2 text-brand-teal text-xs font-black uppercase mb-4 tracking-widest"><Move size={14}/> Yerleşim</label>
                     <select 
                       value={selectedPlacement} 
                       onChange={(e) => setSelectedPlacement(e.target.value)}
                       className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 text-xs font-black uppercase outline-none focus:border-brand-teal transition-colors"
                     >
                       {bodyPlacements.map(p => <option key={p} value={p} className="bg-brand-dark">{p}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="flex items-center gap-2 text-brand-teal text-xs font-black uppercase mb-4 tracking-widest"><Layers size={14}/> Detay Seviyesi</label>
                     <select 
                       value={selectedComplexity} 
                       onChange={(e) => setSelectedComplexity(e.target.value)}
                       className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-3 text-xs font-black uppercase outline-none focus:border-brand-teal transition-colors"
                     >
                       {complexityLevels.map(l => <option key={l} value={l} className="bg-brand-dark">{l}</option>)}
                     </select>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleCreatePrompt}
                disabled={loading || !userPrompt} 
                className="w-full py-6 bg-white/5 border border-white/10 text-brand-teal font-black rounded-[24px] hover:bg-brand-teal hover:text-brand-dark transition-all uppercase tracking-[0.3em] text-sm shadow-xl shadow-brand-teal/5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'TASLAĞI HAZIRLA'}
              </button>
            </div>

            {/* Sonuç Alanı */}
            <div className="lg:col-span-7 space-y-8">
               {refinedPromptText && (
                <div className="glass-card p-10 rounded-[40px] animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-brand-purple text-xs font-black uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="animate-pulse" /> Gelişmiş Mürekkep Komutu</span>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-zinc-500 text-xs font-mono leading-relaxed">{refinedPromptText}</p>
                  </div>
                  <button onClick={handleGenerateImage} disabled={loading} className="w-full mt-8 py-6 bg-brand-teal text-brand-dark font-black rounded-3xl hover:bg-brand-purple transition-all uppercase tracking-[0.2em] shadow-2xl shadow-brand-teal/20 flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : <Wand2 />} MÜREKKEBİ ENJEKTE ET
                  </button>
                </div>
              )}

              <div className="aspect-[3/4] w-full bg-white/[0.02] rounded-[60px] border-4 border-dashed border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner group">
                {loading && refinedPromptText ? (
                  <div className="text-center p-12 space-y-8">
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 border-[6px] border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 border-[6px] border-brand-teal border-t-brand-purple rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-3">
                        <p className="text-brand-teal font-black uppercase tracking-[0.3em] text-xl animate-pulse">{step || 'İşleniyor...'}</p>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Hustle Ink v3.0 Motoru</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="p-10 h-full w-full flex flex-col items-center justify-center gap-10 bg-zinc-950/20">
                    <div className="relative group/img">
                      <img src={generatedImage} className="max-h-[500px] object-contain drop-shadow-[0_0_80px_rgba(0,242,255,0.3)] rounded-3xl" />
                      <div className="absolute inset-0 bg-brand-teal/10 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                    </div>
                    <div className="flex gap-4">
                       <a href={generatedImage} download="hustle-ink-sablon.png" className="flex items-center gap-2 px-12 py-5 bg-white text-brand-dark font-black rounded-full uppercase text-xs tracking-widest hover:bg-brand-teal hover:text-brand-dark transition-all shadow-xl">
                         <Download size={18} /> Şablonu İndir
                       </a>
                       <button onClick={() => setReferenceImage(generatedImage)} className="flex items-center gap-2 px-12 py-5 bg-white/5 text-brand-teal border border-white/10 font-black rounded-full uppercase text-xs tracking-widest hover:border-brand-teal transition-all">
                         <Maximize2 size={18} /> Yeniden Tasarla
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-20 opacity-20 group-hover:opacity-40 transition-all duration-700">
                    <Wand2 size={100} className="mx-auto mb-8 text-brand-teal" />
                    <h3 className="font-black uppercase tracking-[0.6em] text-3xl text-white mb-4 italic">Kasa</h3>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Dijital iğneler komut bekliyor</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Kütüphanesi */}
            <ScrollReveal>
              <div id="prompt-library" className="glass-card rounded-[60px] p-16 mt-24">
                <div className="flex items-center gap-6 mb-16">
                  <div className="p-5 bg-brand-teal/10 rounded-3xl text-brand-teal">
                    <BookOpen size={40} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Prompt Kütüphanesi</h2>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">İlham Al • Kopyala • Tasarla</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {promptExamples.map((category) => (
                    <div key={category.category} className="space-y-6">
                      <h3 className="text-brand-teal text-xs font-black uppercase tracking-[0.2em] border-b border-white/10 pb-3">{category.category}</h3>
                      <div className="space-y-4">
                        {category.prompts.map((prompt) => (
                          <button 
                            key={prompt}
                            onClick={() => {
                              setUserPrompt(prompt);
                              setCopiedPrompt(prompt);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full text-left p-5 bg-white/5 rounded-2xl border border-transparent hover:border-brand-teal/30 hover:bg-white/10 transition-all group relative"
                          >
                            <p className="text-zinc-400 text-[11px] font-bold leading-relaxed group-hover:text-zinc-200 transition-colors pr-8">{prompt}</p>
                            <div className="absolute top-5 right-5 text-zinc-600 group-hover:text-brand-teal transition-colors">
                              {copiedPrompt === prompt ? <Check size={14} /> : <Copy size={14} />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 animate-in fade-in duration-700">
            {drafts.length > 0 ? drafts.map((draft) => (
              <div key={draft.id} className="group relative aspect-[3/4] glass-card rounded-[40px] overflow-hidden hover:border-brand-teal/40 transition-all duration-500 shadow-2xl">
                <img src={draft.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <p className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-6 line-clamp-2">{draft.prompt}</p>
                  <div className="flex gap-3">
                    <button onClick={() => {setGeneratedImage(draft.imageUrl); setActiveTab('art');}} className="flex-grow py-3 bg-brand-teal text-brand-dark rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Geri Yükle</button>
                    <button onClick={() => deleteDraftFromFirestore(draft.id).then(() => setDrafts(prev => prev.filter(d => d.id !== draft.id)))} className="p-3 bg-red-600/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-60 text-center opacity-20">
                <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-4xl italic">Kasa Henüz Boş</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};