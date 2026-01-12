
import React, { useState, useMemo } from 'react';
import { 
  Property, 
  PropertyType, 
  CategoryType,
  OperationType, 
  PropertyStatus, 
  UserRole, 
  User,
  ExternalListing,
  SavedSearch
} from './types';
import { SAUDI_CITIES, SAUDI_DISTRICTS } from './constants';
import { searchExternalPlatforms } from './services/geminiService';
import MapView from './components/MapView';
import PropertyCard from './components/PropertyCard';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import NotificationCenter, { Notification } from './components/NotificationCenter';
import { 
  Search, Building2, Menu, Map as MapIcon, ExternalLink, 
  Loader2, Zap, MapPin, Maximize, Phone, MessageCircle,
  Coins, Home, Bed, Bath, User as UserIcon, Copy, ListFilter, ShieldCheck, 
  CheckCircle2, AlertTriangle, Image as ImageIcon, RotateCcw, BadgeCheck, X, AlertOctagon,
  Bell, Bookmark, Save, Smartphone, ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'map'>('search');
  const [resultsFilter, setResultsFilter] = useState<'all' | 'trusted' | 'review'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterOp, setFilterOp] = useState<OperationType | ''>('');
  const [filterCategory, setFilterCategory] = useState<CategoryType | ''>('');
  const [filterRooms, setFilterRooms] = useState<string>('');
  
  // Price Range State
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');

  // App Logic State
  const [isSearching, setIsSearching] = useState(false);
  const [externalResults, setExternalResults] = useState<ExternalListing[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<ExternalListing | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'مرحباً بك',
      message: 'تم تفعيل نظام الرصد العقاري بنجاح.',
      type: 'info',
      timestamp: new Date(),
      isRead: false
    }
  ]);

  const availableDistricts = useMemo(() => {
    return filterCity ? (SAUDI_DISTRICTS[filterCity] || []) : [];
  }, [filterCity]);

  // البحث الشامل (الفلاتر)
  const handleGlobalSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setShowResults(false);
    
    try {
      const roomQuery = filterRooms ? `${filterRooms} غرف` : '';
      const priceQuery = priceMin || priceMax ? `سعر ${priceMin || 0} الى ${priceMax || 'مفتوح'}` : '';

      const query = [
        filterOp, 
        filterCategory, 
        roomQuery,
        priceQuery,
        searchTerm, 
        filterDistrict, 
        filterCity
      ].filter(Boolean).join(' ');

      const results = await searchExternalPlatforms(query);
      setExternalResults(results);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePhoneOnlySearch = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    setShowResults(false);

    try {
      const query = `رقم الجوال ${searchPhone}`;
      const results = await searchExternalPlatforms(query);
      setExternalResults(results);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearch = () => {
    const criteriaName = [filterOp, filterCategory, filterCity, filterDistrict, searchPhone ? `جوال: ${searchPhone}` : ''].filter(Boolean).join(' - ') || 'بحث مخصص';
    const newSavedSearch: SavedSearch = {
      id: Math.random().toString(36).substr(2, 9),
      name: criteriaName,
      criteria: JSON.stringify({ filterCity, filterDistrict, filterOp, filterCategory, filterRooms, searchPhone }),
      date: new Date()
    };
    
    setSavedSearches([...savedSearches, newSavedSearch]);
    
    const successNotif: Notification = {
      id: Math.random().toString(),
      title: 'تم حفظ البحث',
      message: `سيتم إشعارك فور توفر عقارات جديدة تطابق: ${criteriaName}`,
      type: 'success',
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  const filteredResults = useMemo(() => {
    if (resultsFilter === 'all') return externalResults;
    if (resultsFilter === 'trusted') return externalResults.filter(r => r.trustScore >= 80);
    return externalResults.filter(r => r.trustScore < 60); // Logic matched to badge colors
  }, [externalResults, resultsFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setSearchPhone('');
    setFilterCity('');
    setFilterDistrict('');
    setFilterOp('');
    setFilterCategory('');
    setFilterRooms('');
    setPriceMin('');
    setPriceMax('');
    setShowResults(false);
  };

  // Helper for quick price sets
  const setQuickPrice = (min: string, max: string) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-['Tajawal'] overflow-hidden">
      
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#0F172A] text-white transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="bg-emerald-500 p-3 rounded-2xl shadow-xl shadow-emerald-500/20"><Building2 size={28} /></div>
              <div className="text-right">
                <span className="font-black text-2xl tracking-tight text-white block">وسطاء النجاح</span>
                <div className="text-[10px] text-slate-400 font-black mt-1 uppercase">AI Property Guard</div>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-3">
            <button onClick={() => { setActiveTab('search'); setIsSidebarOpen(false); }} className={`w-full flex items-center p-4 rounded-2xl transition-all ${activeTab === 'search' ? 'bg-emerald-600 shadow-xl' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Search size={20} className="ml-4" /><span className="font-bold text-sm">البحث والرصد</span>
            </button>
            <button onClick={() => { setActiveTab('map'); setIsSidebarOpen(false); }} className={`w-full flex items-center p-4 rounded-2xl transition-all ${activeTab === 'map' ? 'bg-emerald-600 shadow-xl' : 'text-slate-400 hover:bg-slate-800'}`}>
              <MapIcon size={20} className="ml-4" /><span className="font-bold text-sm">الخريطة الذكية</span>
            </button>
            
            <div className="pt-8 mt-8 border-t border-slate-800">
              <div className="px-4 text-[10px] font-black text-slate-500 uppercase mb-4">عمليات البحث المحفوظة</div>
              {savedSearches.length === 0 ? (
                <div className="px-4 text-xs text-slate-600">لا توجد عمليات بحث محفوظة</div>
              ) : (
                <div className="space-y-2">
                  {savedSearches.map(s => (
                    <div key={s.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="text-xs font-bold text-slate-300">{s.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{new Date(s.date).toLocaleDateString('ar-SA')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden ml-4 p-2 hover:bg-slate-100 rounded-lg"><Menu size={24}/></button>
            <h2 className="font-black text-slate-700 text-lg">منصة الرصد العقاري الموحد</h2>
          </div>
          
          <div className="flex items-center space-x-reverse space-x-4">
             <div className="hidden md:flex items-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 ml-4">
               <ShieldCheck size={18} className="text-emerald-600 ml-2" />
               <span className="text-xs font-black text-emerald-800">النظام نشط وجاهز للرصد</span>
             </div>
             
             <div className="relative">
               <button 
                 onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                 className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all relative"
               >
                 <Bell size={20} className="text-slate-600" />
                 {notifications.filter(n => !n.isRead).length > 0 && (
                   <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                 )}
               </button>
               <NotificationCenter 
                 isOpen={isNotificationsOpen} 
                 onClose={() => setIsNotificationsOpen(false)} 
                 initialNotifications={notifications}
                 onMarkAllRead={() => setNotifications(curr => curr.map(n => ({...n, isRead: true})))}
               />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12">
          {activeTab === 'search' && (
            <div className="max-w-[1400px] mx-auto space-y-12">
              
              <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-16 border border-slate-100">
                <div className="text-center mb-12 md:mb-16">
                  <h1 className="text-3xl md:text-6xl font-black text-[#0F172A] mb-4 tracking-tight leading-tight">رصد عقارات المملكة الموحد</h1>
                  <p className="text-slate-400 font-bold text-sm md:text-xl px-4">محرك بحث شامل يغطي حراج، عقار، بيوت، وواصلت مع التحقق الذكي من البيانات</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                  <div className="space-y-4">
                    <label className="flex items-center text-[11px] font-black text-emerald-600 mr-2 uppercase tracking-[0.2em]">
                      <Home size={16} className="ml-2"/> نوع العملية والعقار
                    </label>
                    <div className="flex bg-[#F1F5F9] rounded-[1.5rem] p-1.5 shadow-inner">
                      <select value={filterOp} onChange={(e) => setFilterOp(e.target.value as any)} className="w-1/2 bg-transparent border-none rounded-xl px-2 md:px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all">
                        <option value="">نوع العملية</option>
                        {Object.values(OperationType).map(op => <option key={op} value={op}>{op}</option>)}
                      </select>
                      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)} className="w-1/2 bg-transparent border-none rounded-xl px-2 md:px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all border-r border-slate-200">
                        <option value="">تصنيف العقار</option>
                        {Object.values(CategoryType).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center text-[11px] font-black text-emerald-600 mr-2 uppercase tracking-[0.2em]">
                      <MapPin size={16} className="ml-2"/> الموقع الجغرافي
                    </label>
                    <div className="flex bg-[#F1F5F9] rounded-[1.5rem] p-1.5 shadow-inner">
                      <select value={filterCity} onChange={(e) => { setFilterCity(e.target.value); setFilterDistrict(''); }} className="w-1/2 bg-transparent border-none rounded-xl px-2 md:px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all">
                        <option value="">كل المدن</option>
                        {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)} disabled={!filterCity} className="w-1/2 bg-transparent border-none rounded-xl px-2 md:px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all disabled:opacity-30 border-r border-slate-200">
                        <option value="">كل الأحياء</option>
                        {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center text-[11px] font-black text-emerald-600 mr-2 uppercase tracking-[0.2em]">
                      <Coins size={16} className="ml-2"/> نطاق السعر (ريال)
                    </label>
                    <div className="flex flex-col space-y-2">
                       {/* Custom Dual Range Inputs with Visual Logic */}
                       <div className="flex bg-[#F1F5F9] rounded-[1.5rem] p-1.5 shadow-inner relative group">
                          <input 
                            type="text" 
                            placeholder="الأقل" 
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)} 
                            className="w-1/2 bg-transparent border-none rounded-xl px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all z-10" 
                          />
                          <div className="w-px bg-slate-200 my-2"></div>
                          <input 
                            type="text" 
                            placeholder="الأعلى" 
                            value={priceMax} 
                            onChange={(e) => setPriceMax(e.target.value)} 
                            className="w-1/2 bg-transparent border-none rounded-xl px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all z-10" 
                          />
                          {/* Visual Range Bar Hint */}
                          <div className="absolute bottom-0 left-4 right-4 h-1 bg-slate-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="h-full bg-emerald-500 w-full opacity-30"></div>
                          </div>
                       </div>
                       
                       {/* Quick Select Pills */}
                       <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                         <button onClick={() => setQuickPrice('0', '1000000')} className="text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200">&lt; 1 مليون</button>
                         <button onClick={() => setQuickPrice('1000000', '2000000')} className="text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200">1-2 مليون</button>
                         <button onClick={() => setQuickPrice('50000', '200000')} className="text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200">إيجار &lt; 200k</button>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center text-[11px] font-black text-emerald-600 mr-2 uppercase tracking-[0.2em]">
                      <ListFilter size={16} className="ml-2"/> المواصفات والبحث
                    </label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex bg-[#F1F5F9] rounded-[1.5rem] p-1.5 shadow-inner">
                        <select 
                          value={filterRooms} 
                          onChange={(e) => setFilterRooms(e.target.value)} 
                          className="w-1/3 bg-transparent border-none rounded-xl px-2 md:px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all"
                        >
                          <option value="">الغرف</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5+</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="كلمات دلالية..." 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                          className="w-2/3 bg-transparent border-none rounded-xl px-4 py-3 font-black text-xs md:text-sm text-slate-700 focus:bg-white focus:shadow-sm outline-none transition-all border-r border-slate-200" 
                        />
                      </div>
                      
                      <div className="flex bg-white rounded-[1.5rem] p-1.5 shadow-sm border border-emerald-100 items-center ring-2 ring-emerald-50">
                        <div className="pl-2 pr-3 text-emerald-600">
                          <Smartphone size={16} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="بحث برقم الجوال..." 
                          value={searchPhone} 
                          onChange={(e) => setSearchPhone(e.target.value)} 
                          className="w-full bg-transparent border-none rounded-xl px-2 py-3 font-black text-xs md:text-sm text-slate-700 outline-none transition-all" 
                        />
                        <button 
                          onClick={handlePhoneOnlySearch}
                          disabled={!searchPhone || isSearching}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                          title="بحث بالرقم"
                        >
                          <Search size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button onClick={handleGlobalSearch} disabled={isSearching} className="w-full sm:w-auto min-w-[280px] bg-[#0F172A] hover:bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg md:text-xl transition-all flex items-center justify-center shadow-2xl shadow-slate-300 active:scale-95 group">
                    {isSearching ? <Loader2 className="animate-spin ml-3" /> : <Zap size={22} className="ml-3 group-hover:animate-pulse" />} 
                    ابحث الآن
                  </button>
                  <button onClick={handleSaveSearch} className="w-full sm:w-auto bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 px-8 py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center active:scale-95">
                    <Bookmark size={20} className="ml-2" /> حفظ البحث
                  </button>
                  <button onClick={resetFilters} className="w-full sm:w-auto bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-400 px-6 py-5 rounded-[2rem] font-bold text-lg transition-all flex items-center justify-center active:scale-95">
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>

              {isSearching && (
                <div className="text-center py-24 animate-pulse">
                  <div className="w-24 h-24 border-8 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-8 shadow-xl"></div>
                  <h3 className="text-3xl font-black text-[#0F172A]">جاري مسح المنصات العقارية...</h3>
                  <p className="text-slate-400 font-bold mt-2">عقار، حراج، بيوت، وصلت، والمزيد</p>
                </div>
              )}

              {showResults && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-8">
                    <div className="flex bg-[#F1F5F9] p-1.5 rounded-[2rem] border border-slate-200 shadow-sm w-full lg:w-auto overflow-x-auto">
                      <button onClick={() => setResultsFilter('all')} className={`flex-1 whitespace-nowrap px-6 lg:px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all ${resultsFilter === 'all' ? 'bg-[#0F172A] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>الكل ({externalResults.length})</button>
                      <button onClick={() => setResultsFilter('trusted')} className={`flex-1 whitespace-nowrap px-6 lg:px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all ${resultsFilter === 'trusted' ? 'bg-emerald-600 text-white shadow-xl' : 'text-emerald-600/60 hover:text-emerald-600'}`}>موثوقة ✨</button>
                      <button onClick={() => setResultsFilter('review')} className={`flex-1 whitespace-nowrap px-6 lg:px-10 py-4 rounded-[1.5rem] text-sm font-black transition-all ${resultsFilter === 'review' ? 'bg-rose-500 text-white shadow-xl' : 'text-rose-600/60 hover:text-rose-600'}`}>تحت المراجعة ⚠️</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
                    {filteredResults.map((res, i) => (
                      <PropertyCard 
                        key={i} 
                        property={res} 
                        onClick={() => setSelectedProperty(res)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-full rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white">
              <MapView properties={[]} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
