
import React from 'react';
import { Property, OperationType, ExternalListing } from '../types';
import TrustScoreBadge from './TrustScoreBadge';
import { Phone, MessageCircle, MapPin, Maximize, Building2, Briefcase, AlertTriangle, ShieldCheck, User as UserIcon, Bath, Bed, BadgeCheck, XCircle, Globe } from 'lucide-react';

interface Props {
  property: Property | ExternalListing;
  onLeadCreate?: (pId: string) => void;
  onClick?: () => void;
}

const PropertyCard: React.FC<Props> = ({ property, onLeadCreate, onClick }) => {
  const trustScore = property.trustScore || 0;
  
  // --- 3-Tier Visual Distinction Logic ---
  let theme = {
    // Default / Low Trust (< 50) - Red
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50/40',
    shadowColor: 'shadow-rose-100',
    badgeIcon: <XCircle size={14} className="ml-1" />,
    badgeText: 'بيانات ضعيفة',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    contactBg: 'bg-rose-50 border-rose-100',
    locationIconColor: 'text-rose-400'
  };

  if (trustScore >= 80) {
    // High Trust (>= 80) - Green
    theme = {
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50/40',
      shadowColor: 'shadow-emerald-100',
      badgeIcon: <BadgeCheck size={14} className="ml-1" />,
      badgeText: 'موثوقية عالية',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      contactBg: 'bg-emerald-50 border-emerald-100',
      locationIconColor: 'text-emerald-500'
    };
  } else if (trustScore >= 50) {
    // Medium Trust (50-79) - Yellow
    theme = {
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50/40',
      shadowColor: 'shadow-amber-100',
      badgeIcon: <AlertTriangle size={14} className="ml-1" />,
      badgeText: 'موثوقية متوسطة',
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
      contactBg: 'bg-amber-50 border-amber-100',
      locationIconColor: 'text-amber-500'
    };
  }

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl || ''];
  const price = typeof property.price === 'number' ? property.price : property.price;
  const area = property.area;
  const type = (property as any).type || property.title;
  const district = (property as any).district || (property as any).location || '';
  const city = (property as any).city || '';
  const ownerName = property.ownerName || 'غير معروف';
  const phone = (property as any).ownerPhone || (property as any).phone || '';
  const source = (property as any).source || 'Other';

  const formatPrice = (p: string | number | undefined) => {
    if (!p) return '—';
    if (typeof p === 'string') return p;
    return new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(p);
  };

  const getSourceIcon = (src: string) => {
    const s = src.toLowerCase();
    let colorClass = 'bg-slate-100 text-slate-600';
    let label = src;

    if (s.includes('aqar')) { colorClass = 'bg-[#4B0082]/10 text-[#4B0082] border-[#4B0082]/20'; label = 'عقار'; }
    else if (s.includes('haraj')) { colorClass = 'bg-[#1155cc]/10 text-[#1155cc] border-[#1155cc]/20'; label = 'حراج'; }
    else if (s.includes('bayut')) { colorClass = 'bg-[#E30613]/10 text-[#E30613] border-[#E30613]/20'; label = 'بيوت'; }
    else if (s.includes('wasalt')) { colorClass = 'bg-pink-500/10 text-pink-600 border-pink-500/20'; label = 'وصلت'; }

    return (
      <div className={`flex items-center px-2 py-1 rounded-lg border text-[10px] font-black ${colorClass}`}>
        <Globe size={10} className="ml-1" />
        {label}
      </div>
    );
  };

  const opStyle = (property as any).operation ? 
    { bg: 'bg-slate-700', text: (property as any).operation } : 
    { bg: 'bg-slate-800', text: 'عرض' };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[2.5rem] border-2 ${theme.borderColor} ${theme.bgColor} overflow-hidden hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer transition-all duration-500 flex flex-col h-full group relative`}
    >
      
      {(property as any).isVerified && (
        <div className="absolute top-6 left-6 z-20 bg-emerald-500 text-white p-2 rounded-2xl shadow-2xl border-4 border-white">
          <ShieldCheck size={20} />
        </div>
      )}

      {/* Top Banner based on Trust Score */}
      <div className={`absolute top-0 left-0 right-0 py-1.5 px-4 z-20 flex items-center justify-center space-x-reverse space-x-2 shadow-sm backdrop-blur-md bg-white/90 border-b ${theme.borderColor}`}>
          <span className={`${theme.badgeClass} flex items-center px-2 py-0.5 rounded-full text-[10px] font-black`}>
             {theme.badgeIcon} {theme.badgeText} ({trustScore}%)
          </span>
      </div>

      <div className="relative h-64 overflow-hidden mt-8">
        <img 
          src={images[0] || `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800`} 
          alt={type}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        
        <div className={`absolute top-4 right-6 ${opStyle.bg} text-white px-5 py-2 rounded-2xl text-[11px] font-black shadow-xl flex items-center z-10`}>
          {opStyle.text}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <Building2 size={12} className="ml-1"/>
                {(property as any).category || 'عقار'}
             </div>
             {/* Source Icon Added Here */}
             {getSourceIcon(source)}
          </div>
          <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-2 min-h-[3.5rem]">{type} {district ? `- ${district}` : ''}</h3>
          <div className="flex items-center text-slate-500 text-xs font-bold mt-2">
            <MapPin size={16} className={`ml-1 ${theme.locationIconColor}`} />
            {city || (property as any).location || 'الموقع غير محدد'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white p-2 rounded-2xl text-center border border-slate-100 shadow-sm">
            <Maximize size={16} className="mx-auto text-emerald-500 mb-1" />
            <span className="block text-[10px] font-black text-slate-800">{area || '—'}</span>
            <span className="text-[9px] text-slate-400">م²</span>
          </div>
          <div className="bg-white p-2 rounded-2xl text-center border border-slate-100 shadow-sm">
             <Bed size={16} className="mx-auto text-emerald-500 mb-1" />
             <span className="block text-[10px] font-black text-slate-800">{(property as any).rooms || '—'}</span>
             <span className="text-[9px] text-slate-400">غرف</span>
          </div>
          <div className="bg-white p-2 rounded-2xl text-center border border-slate-100 shadow-sm">
             <Bath size={16} className="mx-auto text-emerald-500 mb-1" />
             <span className="block text-[10px] font-black text-slate-800">{(property as any).bathrooms || '—'}</span>
             <span className="text-[9px] text-slate-400">حمام</span>
          </div>
        </div>

        {/* Enhanced Contact Box with Trust Coloring */}
        <div className={`${theme.contactBg} rounded-2xl p-4 mb-4 border relative overflow-hidden group-hover:shadow-md transition-shadow`}>
           <div className="relative z-10 space-y-4">
             <div className="flex flex-col border-b border-black/5 pb-3">
                <div className="flex items-center text-slate-500 text-xs font-bold mb-1">
                  <UserIcon size={14} className="ml-1.5 text-slate-700" /> المالك:
                </div>
                <span className="text-base font-black text-slate-900 truncate" title={ownerName}>{ownerName}</span>
             </div>
             <div className="flex flex-col">
                <div className="flex items-center text-slate-500 text-xs font-bold mb-1">
                  <Phone size={14} className="ml-1.5 text-slate-700" /> الجوال:
                </div>
                <span className="text-xl font-black text-slate-900 font-mono bg-white px-3 py-2 rounded-xl shadow-sm text-center tracking-widest border border-slate-100/50" dir="ltr">
                  {phone || '—'}
                </span>
             </div>
           </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase">السعر المطلوب</div>
            <div className="flex items-baseline">
              <span className="text-xl font-black text-slate-900">{formatPrice(price)}</span>
              {typeof price === 'number' && <span className="text-[9px] font-bold text-slate-500 mr-1">ريال</span>}
            </div>
          </div>
          
          <div className="flex space-x-reverse space-x-2">
            {phone && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '966')}`, '_blank'); }} 
                  className="w-10 h-10 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center"
                  title="واتساب"
                >
                  <MessageCircle size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(`tel:${phone}`, '_self'); }} 
                  className="w-10 h-10 bg-[#0F172A] text-white rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center"
                  title="اتصال"
                >
                  <Phone size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
