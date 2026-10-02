import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../api/client';
import type { Page } from '../types';
import { 
  ShieldCheck, 
  Layers, 
  FileText, 
  ChevronRight, 
  Award, 
  Anchor, 
  Compass, 
  Building2,
  Sparkles
} from 'lucide-react';

import aboutSectionImg from '../assets/sections/about.jpg';

const DEFAULT_CORPORATE_PAGES: Record<string, Partial<Page>> = {
  'hakkimizda': {
    slug: 'hakkimizda',
    titleTr: 'Hakkımızda',
    titleEn: 'About Us',
    summaryTr: '25 yılı aşkın tecrübemizle marin vinçleri, mobil boat hoist ve ağır sanayi kaldırma ekipmanlarında güvenilir mühendislik ortağınız.',
    summaryEn: 'With over 25 years of experience, we are your reliable engineering partner in marine cranes, mobile boat hoists, and heavy industrial lifting equipment.',
    contentTr: `
      <p class="lead-text"><strong>Songur Marin Makine</strong>; marin vinçleri, mobil boat hoist, bot taşıyıcılar ve ağır sanayi kaldırma ekipmanlarında Türkiye ve çevre coğrafyada lider mühendislik ve satış sonrası servis çözümleri sunmaktadır.</p>
      
      <p>Denizcilik sektöründeki 25 yılı aşkın tecrübemizle; marina, liman, tersane ve imalat tesislerine özel yüksek kapasiteli kaldırma ve taşıma sistemlerinin projelendirme, satış, kurulum, yetkili servis ve periyodik bakım hizmetlerini titizlikle yürütmekteyiz.</p>
      
      <h3>Güvenilirlik ve Üstün Mühendislik</h3>
      <p>Temsilciliğini üstlendiğimiz küresel lider markaların üstün teknolojisini, Türkiye'deki güçlü yerel servis altyapımızla birleştiriyoruz. Müşterilerimizin operasyonel güvenliğini ve iş verimliliğini en üst düzeye çıkarmak temel önceliğimizdir.</p>
      
      <blockquote>
        "Mühendislik uzmanlığımız ve ödünsüz kalite anlayışımızla, denizcilik ve sanayi sektörünün en zorlu kaldırma operasyonlarına emniyetli ve sürdürülebilir çözümler üretiyoruz."
      </blockquote>

      <h3>Neden Songur Marin Makine?</h3>
      <ul>
        <li><strong>Uluslararası Standartlar:</strong> CE, ISO ve marin güvenlik normlarına tam uyumlu yüksek teknoloji ekipmanlar.</li>
        <li><strong>Geniş Ürün Yelpazesi:</strong> 25 tondan 1000+ tona kadar mobil boat hoist, marin pergel vinçler ve transfer arabaları.</li>
        <li><strong>Kesintisiz 7/24 Teknik Destek:</strong> Sertifikalı uzman teknik kadro ve hızlı orijinal yedek parça temini.</li>
        <li><strong>Anahtar Teslim Hizmet:</strong> Keşif, projelendirme, nakliye, montaj, test ve operatör eğitimleri dahil uçtan uca yönetim.</li>
      </ul>
    `,
    contentEn: `
      <p class="lead-text"><strong>Songur Marin Machinery</strong> provides leading engineering and after-sales service solutions for marine cranes, mobile boat hoists, boat transporters, and heavy industrial lifting equipment across Turkey and surrounding regions.</p>
      
      <p>With over 25 years of specialized experience in the maritime industry, we handle the complete lifecycle of high-capacity lifting and handling systems for marinas, ports, shipyards, and manufacturing facilities—including pre-engineering, sales, installation, authorized service, and periodic maintenance.</p>
      
      <h3>Reliability & Superior Engineering</h3>
      <p>We combine the cutting-edge technology of the global leader brands we represent with our strong local technical support infrastructure. Maximizing operational safety and efficiency for our clients is our highest priority.</p>
      
      <blockquote>
        "Through engineering expertise and an uncompromising commitment to quality, we engineer safe and sustainable solutions for the most demanding heavy lifting operations in the marine sector."
      </blockquote>

      <h3>Why Songur Marin Machinery?</h3>
      <ul>
        <li><strong>Global Standards:</strong> Fully compliant equipment with CE, ISO, and rigorous maritime safety standards.</li>
        <li><strong>Comprehensive Portfolio:</strong> Mobile boat hoists from 25t to 1000t+, marine jib cranes, and transfer carts.</li>
        <li><strong>24/7 Technical Support:</strong> Certified technical engineers and rapid delivery of original spare parts.</li>
        <li><strong>Turnkey Execution:</strong> End-to-end execution including site surveys, custom engineering, transport, commissioning, and operator training.</li>
      </ul>
    `,
  },
  'misyon-vizyon': {
    slug: 'misyon-vizyon',
    titleTr: 'Misyon & Vizyonumuz',
    titleEn: 'Our Mission & Vision',
    summaryTr: 'Sektördeki kalite standartlarını üst seviyeye taşımak, emniyetli, inovatif ve sürdürülebilir kaldırma çözümleri sunmak.',
    summaryEn: 'Elevating industry standards by providing safe, innovative, and sustainable lifting solutions.',
    contentTr: `
      <p class="lead-text">Songur Marin Makine olarak vizyonumuz; Akdeniz, Karadeniz ve Orta Doğu denizcilik havzasında marin vinç ve bot taşıyıcı sistemlerinde akla gelen ilk güvenilir mühendislik ve servis markası olmaktır.</p>

      <h3>Misyonumuz</h3>
      <p>Denizcilik ve ağır sanayi sektöründe faaliyet gösteren müşterilerimizin operasyonel verimliliklerini en üst düzeye çıkarmak için dünya standartlarında emniyetli, dayanıklı ve teknolojik kaldırma çözümleri sunmak; satış sonrasında kesintisiz uzman teknik destekle güvenilir bir çözüm ortağı olmak.</p>

      <h3>Vizyonumuz</h3>
      <p>Temsil ettiğimiz lider markaların küresel gücünü yerel mühendislik yetkinliklerimizle birleştirerek, bölgenin en saygın ve tercih edilen marin ağır kaldırma ekipmanları tedarikçisi ve yetkili servis sağlayıcısı konumunu kalıcı kılmak.</p>

      <h3>Temel Değerlerimiz ve Kalite Politikamız</h3>
      <ul>
        <li><strong>Sıfır Hata ve Emniyet:</strong> Uluslararası denizcilik ve iş güvenliği regülasyonlarına ödünsüz uyum.</li>
        <li><strong>Müşteri Odaklılık:</strong> İhtiyaca özel mühendislik çözümleri ve uzun vadeli güvene dayalı iş ortaklığı.</li>
        <li><strong>Kesintisiz Hizmet:</strong> 7/24 hızlı müdahale, mobil servis araçları ve orijinal yedek parça güvencesi.</li>
        <li><strong>Sürekli Gelişim:</strong> Sektörel yenilikleri, yeşil enerji trendlerini ve otomasyon teknolojilerini yakından takip.</li>
      </ul>
    `,
    contentEn: `
      <p class="lead-text">Our vision at Songur Marin Machinery is to remain the most trusted engineering and service brand for marine cranes and boat handling systems across the Mediterranean, Black Sea, and Middle East.</p>

      <h3>Our Mission</h3>
      <p>To maximize the operational efficiency of our clients in maritime and heavy industries by providing world-class safe, durable, and innovative lifting solutions; and serving as a dependable partner through non-stop expert after-sales support.</p>

      <h3>Our Vision</h3>
      <p>To blend the strength of the world-class brands we represent with our local engineering competence, sustaining our position as the region's most reputable supplier and authorized service provider for marine heavy lifting equipment.</p>

      <h3>Our Core Values & Quality Policy</h3>
      <ul>
        <li><strong>Zero Compromise on Safety:</strong> Absolute adherence to international maritime and operational safety standards.</li>
        <li><strong>Customer-Centric Focus:</strong> Customized engineering solutions and long-term partnerships built on mutual trust.</li>
        <li><strong>Continuous Service:</strong> 24/7 fast-response mobile technical units and original spare parts assurance.</li>
        <li><strong>Continuous Innovation:</strong> Actively adopting industry breakthroughs, eco-friendly drive systems, and automation.</li>
      </ul>
    `,
  },
  'kvkk': {
    slug: 'kvkk',
    titleTr: 'KVKK Aydınlatma Metni',
    titleEn: 'Privacy & Data Protection Policy',
    summaryTr: '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca kişisel verilerin işlenmesi ve korunması bilgilendirme metni.',
    summaryEn: 'Information statement pursuant to Personal Data Protection regulations regarding data privacy.',
    contentTr: `
      <p class="lead-text">Songur Marin Makine San. ve Tic. Ltd. Şti. olarak müşterilerimizin, iş ortaklarımızın ve ziyaretçilerimizin kişisel verilerinin güvenliğine ve gizliliğine en üst düzeyde önem veriyoruz.</p>

      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla şirketimiz tarafından toplanan kişisel verileriniz aşağıdaki ilkeler çerçevesinde işlenmekte ve muhafaza edilmektedir.</p>

      <h3>1. İşlenen Kişisel Veriler ve Toplama Amaçları</h3>
      <p>Şirketimiz ile web sitemiz, iletişim formları, telefon veya e-posta kanalları aracılığıyla paylaştığınız ad, soyad, unvan, e-posta adresi, telefon numarası ve kurum bilgileri yalnızca aşağıdaki amaçlar doğrultusunda işlenir:</p>
      <ul>
        <li>Ürün, teklif ve teknik servis taleplerinizin değerlendirilmesi ve karşılanması</li>
        <li>Sözleşme süreçlerinin yürütülmesi ve ticari faaliyetlerin gerçekleştirilmesi</li>
        <li>Yasal yükümlülüklerin eksiksiz yerine getirilmesi ve yetkili kurumlara bilgi verilmesi</li>
        <li>Müşteri memnuniyetinin artırılması ve destek süreçlerinin takibi</li>
      </ul>

      <h3>2. Kişisel Verilerin Aktarılması</h3>
      <p>Kişisel verileriniz, açık rızanız olmaksızın üçüncü taraflarla paylaşılmaz. Yalnızca yasal zorunluluklar çerçevesinde yetkili kamu kurum ve kuruluşları ile mevzuata uygun şekilde paylaşılabilir.</p>

      <h3>3. Veri Güvenliği ve Saklama</h3>
      <p>Verileriniz, yetkisiz erişim, kayıp ve zarara karşı güncel teknik ve idari güvenlik önlemleri alınmış güvenli sunucularda yasal saklama süreleri boyunca muhafaza edilir.</p>

      <h3>4. Veri Sahibinin Hakları</h3>
      <p>KVKK'nın 11. maddesi uyarınca veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahiptir. Başvurularınızı <a href="mailto:info@songurmarin.com" class="text-blue-600 font-bold underline">info@songurmarin.com</a> e-posta adresimize iletebilirsiniz.</p>
    `,
    contentEn: `
      <p class="lead-text">As Songur Marin Machinery Co. Ltd., we attach the utmost importance to the security and privacy of the personal data of our customers, partners, and visitors.</p>

      <p>In accordance with data protection regulations, personal data collected by our company in the capacity of data controller is processed and preserved under the following principles.</p>

      <h3>1. Data Collected and Purposes of Processing</h3>
      <p>Personal details such as name, surname, company title, email address, and phone number submitted via our website, inquiry forms, phone, or email are processed exclusively for:</p>
      <ul>
        <li>Evaluating and responding to equipment quotations, technical support, and service inquiries</li>
        <li>Executing commercial contracts and authorized distributor operations</li>
        <li>Fulfilling statutory legal and regulatory obligations</li>
        <li>Enhancing customer support and operational workflow</li>
      </ul>

      <h3>2. Data Security & Rights</h3>
      <p>Your data is securely stored against unauthorized access in compliance with legal retention periods and is never transferred to third parties without lawful grounds. For any data inquiries, please reach out to <a href="mailto:info@songurmarin.com" class="text-blue-600 font-bold underline">info@songurmarin.com</a>.</p>
    `,
  }
};

const CORPORATE_LINKS = [
  { slug: 'hakkimizda', titleTr: 'Hakkımızda', titleEn: 'About Us', icon: Building2 },
  { slug: 'misyon-vizyon', titleTr: 'Misyon & Vizyon', titleEn: 'Mission & Vision', icon: Compass },
  { slug: 'kvkk', titleTr: 'KVKK Metni', titleEn: 'Privacy Policy', icon: FileText },
];

export const CorporatePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { getField, t, language } = useLanguage();

  const targetSlug = slug || (location.pathname === '/kvkk' ? 'kvkk' : 'hakkimizda');
  const fallback = DEFAULT_CORPORATE_PAGES[targetSlug] || DEFAULT_CORPORATE_PAGES['hakkimizda'];

  const [pageData, setPageData] = useState<Page | null>(() => (DEFAULT_CORPORATE_PAGES[targetSlug] as Page) || null);

  useEffect(() => {
    let isMounted = true;
    // Set immediate default content on slug switch for instant 0ms transition
    if (DEFAULT_CORPORATE_PAGES[targetSlug]) {
      setPageData(DEFAULT_CORPORATE_PAGES[targetSlug] as Page);
    }

    const fetchPage = async () => {
      try {
        const page = await apiService.getPageBySlug(targetSlug);
        if (isMounted && page) {
          setPageData(page);
        }
      } catch {
        // Fallback already in place
      }
    };
    fetchPage();
    return () => { isMounted = false; };
  }, [targetSlug]);
  const title = getField(pageData || fallback, 'title') || fallback.titleTr;
  const summary = getField(pageData || fallback, 'summary') || fallback.summaryTr;
  const content = getField(pageData || fallback, 'content') || (language === 'en' ? fallback.contentEn : fallback.contentTr);
  const imageSrc = pageData?.imageUrl || aboutSectionImg;

  const getIcon = () => {
    if (targetSlug === 'misyon-vizyon') return <ShieldCheck className="w-6 h-6 text-sky-400" />;
    if (targetSlug === 'kvkk') return <FileText className="w-6 h-6 text-sky-400" />;
    return <Layers className="w-6 h-6 text-sky-400" />;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 text-slate-800">
      
      {/* Top Hero Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white pt-12 pb-16 lg:pb-20 border-b border-slate-800 relative overflow-hidden">
        {/* Background Subtle Highlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-medium">
            <Link to="/" className="hover:text-sky-300 transition-colors">{t('navHome')}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">{t('navCorporate')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-sky-400 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-800/40">
              {title}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('corpPillTitle')}</span>
              </div>
              
              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 p-0.5 shadow-lg shadow-blue-900/40 shrink-0">
                  <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
                    {getIcon()}
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
                  {title}
                </h1>
              </div>

              {summary && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed pt-1 max-w-2xl">
                  {summary}
                </p>
              )}
            </div>

            {/* Quick Page Switcher Tabs */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md shrink-0 self-start lg:self-end">
              {CORPORATE_LINKS.map((link) => {
                const isActive = targetSlug === link.slug;
                const Icon = link.icon;
                const linkTitle = language === 'en' ? link.titleEn : link.titleTr;
                return (
                  <button
                    key={link.slug}
                    onClick={() => navigate(link.slug === 'kvkk' ? '/kvkk' : `/kurumsal/${link.slug}`)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{linkTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            
            {/* Main Image Box */}
            <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 relative group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 px-2.5 py-0.5 rounded-md inline-block mb-1 shadow-xs">
                    {t('corpMarineEng')}
                  </span>
                  <p className="text-xs font-semibold text-slate-100">
                    {t('corpMarineDesc')}
                  </p>
                </div>
              </div>

              {/* Sub Experience Badge */}
              <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-extrabold text-xs">{t('corpExpBadge')}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{t('corpRepBadge')}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Rich Typography Corporate Text (7 cols) */}
          <div className="lg:col-span-7">
            
            {/* Main Text Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl shadow-slate-200/40 relative">
              
              {/* Subtle Decorative Anchor Icon */}
              <div className="absolute top-8 right-8 opacity-[0.03] pointer-events-none text-slate-900">
                <Anchor className="w-36 h-36" />
              </div>

              {/* Rich Content Container with Luxury Typography Styles */}
              <div className="relative z-10">
                {content ? (
                  <div 
                    className="
                      text-slate-700 text-[15px] sm:text-base leading-relaxed space-y-5 font-normal
                      [&>.lead-text]:text-base [&>.lead-text]:sm:text-lg [&>.lead-text]:font-medium [&>.lead-text]:text-slate-900 [&>.lead-text]:leading-relaxed [&>.lead-text]:pb-4 [&>.lead-text]:border-b [&>.lead-text]:border-slate-100
                      [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-extrabold [&>h2]:text-slate-900 [&>h2]:font-heading [&>h2]:pt-6 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-blue-100
                      [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-blue-950 [&>h3]:font-heading [&>h3]:pt-6 [&>h3]:pb-1 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2.5
                      [&>h3]:before:content-[''] [&>h3]:before:w-1.5 [&>h3]:before:h-4.5 [&>h3]:before:bg-blue-600 [&>h3]:before:rounded-full [&>h3]:before:inline-block
                      [&>h4]:text-base [&>h4]:font-bold [&>h4]:text-slate-800 [&>h4]:pt-3
                      [&>p]:text-slate-600 [&>p]:leading-relaxed [&>p]:text-[15px] sm:[&>p]:text-base
                      [&>ul]:space-y-2.5 [&>ul]:my-5 [&>ul]:bg-slate-50/70 [&>ul]:p-5 [&>ul]:rounded-2xl [&>ul]:border [&>ul]:border-slate-200/70
                      [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:gap-2.5 [&>ul>li]:text-slate-700 [&>ul>li]:text-sm sm:[&>ul>li]:text-[15px] [&>ul>li]:leading-relaxed
                      [&>ul>li]:before:content-['✓'] [&>ul>li]:before:font-black [&>ul>li]:before:text-blue-600 [&>ul>li]:before:bg-blue-100/80 [&>ul>li]:before:w-5 [&>ul>li]:before:h-5 [&>ul>li]:before:rounded-full [&>ul>li]:before:flex [&>ul>li]:before:items-center [&>ul>li]:before:justify-center [&>ul>li]:before:shrink-0 [&>ul>li]:before:text-[10px] [&>ul>li]:before:mt-0.5
                      [&>ol]:space-y-2.5 [&>ol]:my-5 [&>ol]:pl-4 [&>ol]:list-decimal [&>ol]:text-slate-700
                      [&>blockquote]:border-l-4 [&>blockquote]:border-blue-600 [&>blockquote]:bg-gradient-to-r [&>blockquote]:from-blue-50/70 [&>blockquote]:to-sky-50/20 [&>blockquote]:p-5 [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:font-medium [&>blockquote]:text-slate-800 [&>blockquote]:my-6 [&>blockquote]:text-base sm:[&>blockquote]:text-lg [&>blockquote]:leading-relaxed
                      [&>a]:text-blue-600 [&>a]:font-bold [&>a]:underline hover:[&>a]:text-blue-800
                    "
                    dangerouslySetInnerHTML={{ __html: content }} 
                  />
                ) : (
                  <p className="text-slate-500 italic">{t('corpPendingContent')}</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

