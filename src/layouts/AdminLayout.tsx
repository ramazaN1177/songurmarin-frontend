import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ImageIcon, ShieldCheck, Package, Wrench, 
  Layers, Camera, Inbox, Settings, LogOut, ExternalLink, Menu, X, ChevronRight, User as UserIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Gösterge Paneli', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: 'Hero Slider', path: '/admin/hero-slides', icon: <ImageIcon className="w-5 h-5" /> },
    { label: 'Markalar', path: '/admin/brands', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Ürünler', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { label: 'Hizmetler', path: '/admin/services', icon: <Wrench className="w-5 h-5" /> },
    { label: 'Kurumsal Sayfalar', path: '/admin/pages', icon: <Layers className="w-5 h-5" /> },
    { label: 'Galeri', path: '/admin/gallery', icon: <Camera className="w-5 h-5" /> },
    { label: 'Gelen Talepler', path: '/admin/forms', icon: <Inbox className="w-5 h-5" /> },
    { label: 'Site Ayarları', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Header Branding */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-3">
              <img 
                src="/songurmarinlogo.png" 
                alt="Songur Marin Logo" 
                className="h-9 w-auto object-contain bg-white/10 p-1 rounded-lg" 
              />
              <div className="flex flex-col">
                <span className="font-black text-sm text-white tracking-wider uppercase font-heading">
                  SONGUR MARİN
                </span>
                <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest">
                  Yönetim Paneli
                </span>
              </div>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Yönetim Menüsü
            </div>
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    active
                      ? 'bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-white' : 'text-sky-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-sky-300" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">{user?.name || 'Yönetici'}</span>
              <span className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@songurmarin.com'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Siteyi Gör</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors border border-rose-500/30"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top App Bar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-blue-700 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 font-heading hidden sm:block">
              Songur Marin Makine Yönetim Portalı
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors border border-sky-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Web Sitesini İncele</span>
            </a>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
