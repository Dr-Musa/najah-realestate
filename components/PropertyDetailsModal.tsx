
import React from 'react';
import { ExternalListing } from '../types';
import { X, MapPin, Maximize, Bed, Bath, ShieldCheck, AlertTriangle, Phone, MessageCircle, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  property: ExternalListing;
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<Props> = ({ property, onClose }) => {
  const isTrusted = property.trustScore >= 80;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all"
        >
          <X size={24} />
        </button>

        {/* القسم اليمين: الصور */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative bg-slate-100">
          <img 
            src={property.imageUrl || property.images?.[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 right-8 text-white">
            <div className={`inline-flex items-center px-4 py-2 rounded-xl mb-4 text-xs font-black backdrop-blur-md border ${isTrusted ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100' : 'bg-amber-500/30 border-amber-400 text-amber-100'}`}>
              {isTrusted ? <ShieldCheck size={16} className="ml-2"/> : <AlertTriangle size={16} className="ml-2"/>}
              {isTrusted ? 'بيانات موثوقة' : 'بيانات تحتاج مراجعة'}
            </div>
            <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2">{property.price}</h2>
            <p className="text-slate-300 font-bold flex items-center">
              <MapPin size={18} className="ml-2" />
              {property.title}
            </p>
          </div>
        </div>

        {/* القسم اليسار: التفاصيل */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* Trust Score Indicator */}
            <div className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-slate-500">مؤشر جودة البيانات (AI Trust Score)</span>
                <span className={`text-2xl font-black ${isTrusted ? 'text-emerald-600' : 'text-amber-500'}`}>{property.trustScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isTrusted ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${property.trustScore}%` }}
                ></div>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                 <div className="flex items-center text-[10px] bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 whitespace-nowrap">
                   <CheckCircle2 size={12} className="ml-1 text-emerald-500"/> اكتمال السعر
                 </div>
                 <div className="flex items-center text-[10px] bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 whitespace-nowrap">
                   <CheckCircle2 size={12} className="ml-1 text-emerald-500"/> دقة الموقع
                 </div>
                 <div className="flex items-center text-[10px] bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 whitespace-nowrap">
                   <CheckCircle2 size={12} className="ml-1 text-emerald-500"/> تاريخ التحديث
                 </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#F8FAFC] p-4 rounded-3xl text-center border border-slate-100">
                <Maximize size={24} className="mx-auto text-emerald-500 mb-2" />
                <div className="text-lg font-black text-slate-900">{property.area || '—'}</div>
                <div className="text-[10px] text-slate-400 font-bold">المساحة (م²)</div>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-3xl text-center border border-slate-100">
                <Bed size={24} className="mx-auto text-emerald-500 mb-2" />
                <div className="text-lg font-black text-slate-900">{property.rooms || '—'}</div>
                <div className="text-[10px] text-slate-400 font-bold">الغرف</div>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-3xl text-center border border-slate-100">
                <Bath size={24} className="mx-auto text-emerald-500 mb-2" />
                <div className="text-lg font-black text-slate-900">{property.bathrooms || '—'}</div>
                <div className="text-[10px] text-slate-400 font-bold">دورات المياه</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">تفاصيل العقار</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                {property.snippet}
              </p>
            </div>

            {/* Contact Actions - Increased Visibility */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
               <div className="flex flex-col bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                       <div className="text-sm font-bold text-slate-400 mb-1">المعلن / المالك</div>
                       <div className="text-3xl font-black text-slate-900">{property.ownerName}</div>
                     </div>
                     <div className="bg-white p-3 rounded-full shadow-sm">
                        <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
                     <div className="text-sm font-bold text-slate-400">رقم الجوال</div>
                     <div className="text-2xl font-black text-slate-900 tracking-wider font-mono" dir="ltr">{property.phone || '—'}</div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <a href={`https://wa.me/${property.phone?.replace(/\D/g, '').replace(/^0/, '966')}`} target="_blank" className="bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-3xl font-black flex items-center justify-center transition-all shadow-xl shadow-emerald-200 text-lg">
                   <MessageCircle size={24} className="ml-3" /> واتساب
                 </a>
                 <a href={`tel:${property.phone}`} className="bg-[#0F172A] hover:bg-slate-800 text-white py-5 rounded-3xl font-black flex items-center justify-center transition-all shadow-xl shadow-slate-200 text-lg">
                   <Phone size={24} className="ml-3" /> اتصال
                 </a>
               </div>
               <a href={property.uri} target="_blank" className="block w-full text-center text-slate-400 hover:text-emerald-600 text-sm font-bold py-2 transition-colors flex items-center justify-center">
                 <ExternalLink size={14} className="ml-1" /> زيارة رابط المصدر الأصلي ({property.source})
               </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;
