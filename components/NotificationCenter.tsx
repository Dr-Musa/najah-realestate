
import React from 'react';
import { Bell, X, Info, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'lead';
  timestamp: Date;
  isRead: boolean;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  initialNotifications?: Notification[];
  onMarkAllRead?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  initialNotifications = [],
  onMarkAllRead
}) => {
  const unreadCount = initialNotifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-10 w-80 md:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[60] overflow-hidden animate-in slide-in-from-top-4 duration-300">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center">
          <h3 className="font-black text-slate-900 ml-2">الإشعارات</h3>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
              {unreadCount} جديد
            </span>
          )}
        </div>
        <div className="flex items-center space-x-reverse space-x-2">
           <button onClick={onMarkAllRead} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700">تحديد الكل كمقروء</button>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={16}/></button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {initialNotifications.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-bold">لا توجد إشعارات حالياً</div>
        ) : (
          initialNotifications.map(n => (
            <div key={n.id} className={`p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex space-x-reverse space-x-4 ${!n.isRead ? 'bg-emerald-50/30' : ''}`}>
              <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                n.type === 'lead' ? 'bg-emerald-100 text-emerald-600' :
                n.type === 'success' ? 'bg-blue-100 text-blue-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {n.type === 'lead' ? <MessageSquare size={18}/> : <Info size={18}/>}
              </div>
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900">{n.title}</span>
                  <span className="text-[9px] text-slate-400 font-bold">
                    {n.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-slate-50 text-center">
        <button className="text-[11px] font-black text-slate-400 hover:text-slate-600">عرض الأرشيف الكامل</button>
      </div>
    </div>
  );
};

export default NotificationCenter;
