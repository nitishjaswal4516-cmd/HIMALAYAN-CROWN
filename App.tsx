import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  UserRole, 
  BookingStatus, 
  MenuItem, 
  RoomType,
  TableBooking,
  RoomBooking
} from './types';
import { api } from './services/mockApi';
import { GALLERY_IMAGE_IDS } from './services/mockData';
import { 
  Menu, 
  X, 
  ChefHat, 
  Bed, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Send,
  Mountain,
  Crown,
  ChevronRight,
  TrendingUp,
  Users as UsersIcon,
  CreditCard,
  Search,
  Filter,
  FileText,
  Activity
} from 'lucide-react';

// --- Context ---
interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = api.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- Components ---

const Logo: React.FC<{ light?: boolean }> = ({ light }) => (
  <div className="flex items-center space-x-2 group">
    <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-500 ${light ? 'bg-white text-slate-900' : 'bg-slate-900 text-white shadow-lg shadow-slate-200'}`}>
      <Mountain size={20} className="absolute mb-1" />
      <Crown size={14} className={`absolute top-1 transform group-hover:scale-110 transition-transform ${light ? 'text-amber-600' : 'text-amber-400'}`} />
    </div>
    <div className="flex flex-col leading-tight">
      <span className={`text-lg font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>HIMALAYAN</span>
      <span className={`text-[10px] font-bold tracking-[0.2em] ${light ? 'text-amber-400' : 'text-amber-600'}`}>CROWN</span>
    </div>
  </div>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState({ tables: 0, rooms: 0 });
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch pending bookings count for admin
  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      const fetchPending = async () => {
        try {
          const [tables, rooms] = await Promise.all([
            api.getAllTableBookings(),
            api.getAllRoomBookings()
          ]);
          const pendingTables = tables.filter(t => t.status === BookingStatus.PENDING).length;
          const pendingRooms = rooms.filter(r => r.status === BookingStatus.PENDING).length;
          setPendingBookings({ tables: pendingTables, rooms: pendingRooms });
        } catch (error) {
          console.error('Failed to fetch pending bookings:', error);
        }
      };
      fetchPending();
      // Refresh every 30 seconds
      const interval = setInterval(fetchPending, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-all hover:text-amber-600 ${
                  location.pathname === link.path ? 'text-amber-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
                <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="flex items-center space-x-2 text-slate-700 hover:text-amber-600 transition-colors relative">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {user.role === UserRole.ADMIN ? <ShieldCheck size={16} /> : <UserIcon size={16} />}
                  </div>
                  <span className="text-sm font-bold">{user.name}</span>
                  {user.role === UserRole.ADMIN && (pendingBookings.tables > 0 || pendingBookings.rooms > 0) && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {pendingBookings.tables + pendingBookings.rooms}
                    </div>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 py-4 px-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 hover:text-amber-600 rounded-xl"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold"
              >
                Login
              </Link>
            ) : (
               <div className="space-y-2">
                <Link
                  to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-base font-bold text-slate-700 bg-slate-50 rounded-xl relative"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                    {user.role === UserRole.ADMIN ? <ShieldCheck size={16} /> : <UserIcon size={16} />}
                  </div>
                  <span>{user.name}</span>
                  {user.role === UserRole.ADMIN && (pendingBookings.tables > 0 || pendingBookings.rooms > 0) && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {pendingBookings.tables + pendingBookings.rooms}
                    </div>
                  )}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-base font-bold text-red-500"
                >
                  Logout
                </button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Logo light />
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Experience the pinnacle of Himalayan luxury. From snow-capped vistas to award-winning culinary journeys, your stay with us is a royal heritage experience.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="hover:text-amber-500 transition-all transform hover:-translate-y-1"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-all transform hover:-translate-y-1"><Twitter size={20} /></a>
              <a href="#" className="hover:text-amber-500 transition-all transform hover:-translate-y-1"><Instagram size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/menu" className="hover:text-white transition-colors">Royal Menu</Link></li>
              <li><Link to="/rooms" className="hover:text-white transition-colors">Heritage Suites</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">The Gallery</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Concierge</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-500 shrink-0" />
                <span>42 Majestic Way, Himalayan Highlands, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-500 shrink-0" />
                <span>+91 (HIMALAYA) 888-000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-500 shrink-0" />
                <span>concierge@himalayancrown.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Newsletter</h4>
            <p className="text-xs mb-6">Receive exclusive offers for the Himalayan season.</p>
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none px-4 py-2 text-sm focus:ring-0 w-full text-white"
              />
              <button className="bg-amber-600 text-white px-5 py-2 rounded-xl hover:bg-amber-700 transition-colors text-xs font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-10 text-center text-[10px] font-bold tracking-widest uppercase text-slate-600">
          <p>© {new Date().getFullYear()} HOTEL HIMALAYAN CROWN. ELEVATED HOSPITALITY.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage: React.FC = () => {
  return (
    <div>
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Himalayan Background"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-brightness-75" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-amber-400 font-bold tracking-[0.5em] text-xs uppercase mb-6 block animate-in fade-in slide-in-from-bottom duration-700">Namaste & Welcome</span>
          <h1 className="text-5xl md:text-8xl text-white font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom duration-1000">
            A Royal Heritage <br/><span className="italic font-serif text-amber-100">In the Mountains</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-100 mb-12 font-light max-w-2xl mx-auto leading-relaxed opacity-90">
            Hotel Himalayan Crown offers a sanctuary of peace and luxury high above the clouds, where heritage meets the horizon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <Link to="/rooms" className="w-full sm:w-auto bg-white text-slate-950 px-10 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-2xl flex items-center justify-center group">
              Explore Suites <ChevronRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/menu" className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all backdrop-blur-md">
              Dine with Us
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600" className="rounded-2xl shadow-xl mt-12" />
                <img src="https://images.unsplash.com/photo-1601050638917-3f9474b54738?q=80&w=600" className="rounded-2xl shadow-xl" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-amber-600 text-white p-10 rounded-3xl hidden md:block">
                <span className="text-4xl font-bold">100+</span>
                <p className="text-xs font-bold uppercase tracking-widest mt-2">Award Winning Recipes</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Elevated Hospitality, Rooted in Tradition</h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed font-light">
                At Hotel Himalayan Crown, we believe that luxury is about more than just expensive fabrics and golden fittings. It's about the warmth of a smile, the scent of fresh mountain air, and the flavor of a perfectly spiced dish.
              </p>
              <div className="space-y-6 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><CheckCircle2 size={20}/></div>
                  <div>
                    <h4 className="font-bold">Panoramic Mountain Views</h4>
                    <p className="text-sm text-slate-500">Every room faces the majestic peaks of the Himalayan range.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle2 size={20}/></div>
                  <div>
                    <h4 className="font-bold">Ancestral Dining Recipes</h4>
                    <p className="text-sm text-slate-500">Our menu is a curated collection of lost royal Indian recipes.</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="text-amber-600 font-bold hover:text-amber-700 flex items-center group transition-all">
                Learn more about our heritage <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const MenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    api.getMenu().then(setItems);
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '19:00',
    guests: 2,
    mobile: ''
  });
  const [showBooking, setShowBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.bookTable({
        userId: user.id,
        name: user.name,
        mobile: bookingForm.mobile,
        date: bookingForm.date,
        time: bookingForm.time,
        guests: bookingForm.guests
      });
      alert('Your Himalayan dining reservation is confirmed! A confirmation has been sent to your email.');
      setShowBooking(false);
    } catch (err) {
      alert('Failed to process reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <span className="text-amber-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">The Royal Kitchen</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Imperial Indian Cuisine</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Discover a tapestry of flavors crafted from generations-old family recipes, prepared with contemporary mountain freshness.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (cat !== 'Breads' && cat !== 'Beverages') && (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat ? 'bg-slate-900 text-white shadow-2xl' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map(item => (
            <div key={item.id} className="group cursor-default">
              <div className="relative h-80 rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img src={item.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-2xl shadow-xl">
                  <span className="text-slate-900 font-bold">${item.price}</span>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{item.name}</h3>
                </div>
                <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase border-b border-slate-100 pb-1">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 rounded-[3rem] bg-slate-950 p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-20 -mb-20 blur-3xl" />
          <h2 className="text-4xl font-bold text-white mb-6 relative z-10">An Unforgettable Evening Awaits</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto font-light leading-relaxed">Book your table now to experience royal Himalayan dining under the stars.</p>
          <button 
            onClick={() => setShowBooking(true)}
            className="bg-white text-slate-950 px-12 py-4 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all shadow-2xl relative z-10"
          >
            Reserve Your Table
          </button>
        </div>
      </div>

      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowBooking(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">Reserve a Table</h3>
                  <p className="text-slate-400 text-sm mt-1">Himalayan Crown Dining Hall</p>
                </div>
                <button onClick={() => setShowBooking(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dining Date</label>
                    <input required type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Preferred Time</label>
                    <input required type="time" value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Guest Count</label>
                    <input required type="number" min="1" max="20" value={bookingForm.guests} onChange={e => setBookingForm({...bookingForm, guests: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mobile Contact</label>
                    <input required type="tel" placeholder="+91 ..." value={bookingForm.mobile} onChange={e => setBookingForm({...bookingForm, mobile: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 font-medium" />
                  </div>
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200 mt-4 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <><Clock size={18} className="animate-spin mr-2"/> Processing...</>
                  ) : 'Confirm My Reservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'General Concierge',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confRef, setConfRef] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.sendContactMessage(formData);
      const ref = `HC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      setConfRef(ref);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to send message. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ firstName: '', lastName: '', email: '', department: 'General Concierge', message: '' });
    setConfRef('');
  };

  return (
    <div className="py-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <span className="text-amber-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Concierge Desk</span>
            <h1 className="text-5xl md:text-6xl font-bold mb-10 leading-tight text-slate-900 font-serif">Namaste. <br/>How may we serve you?</h1>
            <p className="text-slate-500 mb-14 max-w-md text-lg font-light leading-relaxed">
              Our 24/7 royal concierge team is here to assist with dining reservations, heritage stay inquiries, or custom event planning.
            </p>
            
            <div className="space-y-12">
              <div className="flex items-start space-x-6 group">
                <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm"><MapPin size={24}/></div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Our Location</h4>
                  <p className="text-slate-500 font-light">Shimla , Himalayan Highlands <br/>Mountain Province, 171001</p>
                </div>
              </div>
              <div className="flex items-start space-x-6 group">
                <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"><Phone size={24}/></div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Direct Line</h4>
                  <p className="text-slate-500 font-light">+91 (HIMALAYA) 888-000 <br/>+91 (0) 555-432-109</p>
                </div>
              </div>
              <div className="flex items-start space-x-6 group">
                <div className="bg-slate-50 text-slate-900 p-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm"><Mail size={24}/></div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Inquiries</h4>
                  <p className="text-slate-500 font-light">concierge@himalayancrown.com <br/>events@himalayancrown.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-12 rounded-[3.5rem] relative shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-right duration-700 overflow-hidden min-h-[500px] flex flex-col justify-center">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-inner ring-4 ring-emerald-50">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-slate-900 font-serif">Message Received</h2>
                <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100 mb-8">
                  <FileText size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">REF ID: {confRef}</span>
                </div>
                <p className="text-slate-500 mb-10 max-w-xs text-lg font-light leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{formData.firstName}</span>. Your inquiry has been securely transmitted. 
                  Our concierge will respond within 24 hours.
                </p>
                <button 
                  onClick={resetForm}
                  className="bg-slate-900 text-white font-bold px-12 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 w-full"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">First Name</label>
                    <input required type="text" placeholder="Enter name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border-none bg-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-slate-700 shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Last Name</label>
                    <input required type="text" placeholder="Surname" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border-none bg-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-slate-700 shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                  <input required type="email" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-none bg-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium text-slate-700 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Message</label>
                  <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Tell us about your requirements..." className="w-full border-none bg-white rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none font-medium text-slate-700 shadow-sm"></textarea>
                </div>
                <button disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-2xl mt-4 group">
                  {isSubmitting ? <><Clock size={18} className="animate-spin" /> <span>Sending...</span></> : <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> <span>Send Message</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RoomsPage: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    api.getRoomTypes().then(setRoomTypes);
  }, []);

  const [bookingForm, setBookingForm] = useState({
    roomTypeId: '',
    roomTypeName: '',
    checkIn: '',
    checkOut: '',
    roomsCount: 1,
    pricePerNight: 0
  });
  const [showBooking, setShowBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nights = (bookingForm.checkIn && bookingForm.checkOut) 
    ? Math.max(1, Math.ceil((new Date(bookingForm.checkOut).getTime() - new Date(bookingForm.checkIn).getTime()) / (1000 * 3600 * 24)))
    : 1;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.bookRoom({
        userId: user.id,
        roomTypeId: bookingForm.roomTypeId,
        roomTypeName: bookingForm.roomTypeName,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        nights,
        roomsCount: bookingForm.roomsCount,
        totalPrice: bookingForm.pricePerNight * nights * bookingForm.roomsCount
      });
      alert('Your Himalayan stay is reserved!');
      setShowBooking(false);
    } catch (err) {
      alert('Failed to process booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <span className="text-amber-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Royal Accommodations</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">Heritage Mountain Suites</h1>
        </div>

        <div className="space-y-16">
          {roomTypes.map(room => (
            <div key={room.id} className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row hover:shadow-slate-300/50 transition-all duration-500 group border border-slate-100">
              <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden">
                <img src={room.image} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={room.type} />
              </div>
              <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-4xl font-bold text-slate-900 mb-2">{room.type}</h3>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <UserIcon size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Sleeps {room.capacity} Guests</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-amber-600">${room.pricePerNight}</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">per night</p>
                    </div>
                  </div>
                  <p className="text-slate-500 mb-10 leading-relaxed font-light text-lg">{room.description}</p>
                </div>
                <button 
                  onClick={() => {
                    setBookingForm({...bookingForm, roomTypeId: room.id, roomTypeName: room.type, pricePerNight: room.pricePerNight});
                    setShowBooking(true);
                  }}
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all text-center shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Begin My Reservation</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowBooking(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900">Reserve {bookingForm.roomTypeName}</h3>
                </div>
                <button onClick={() => setShowBooking(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Check-In</label>
                    <input required type="date" value={bookingForm.checkIn} onChange={e => setBookingForm({...bookingForm, checkIn: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Check-Out</label>
                    <input required type="date" value={bookingForm.checkOut} onChange={e => setBookingForm({...bookingForm, checkOut: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
                  </div>
                </div>
                <div className="bg-slate-950 p-8 rounded-[2rem] flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Stay Value</span>
                    <p className="text-white/60 text-[10px] mt-1 italic">{nights} Night(s)</p>
                  </div>
                  <span className="text-3xl font-bold text-white">${bookingForm.pricePerNight * nights * bookingForm.roomsCount}</span>
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all text-lg shadow-xl shadow-blue-100">
                  {isSubmitting ? <Clock size={18} className="animate-spin inline mr-2" /> : 'Confirm Reservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useApp();
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (user) {
      const [tables, rooms] = await Promise.all([
        api.getUserTableBookings(user.id),
        api.getUserRoomBookings(user.id)
      ]);
      setTableBookings(tables.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setRoomBookings(rooms.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const cancelTable = async (id: string) => {
    if (confirm('Cancel reservation?')) {
      await api.updateTableStatus(id, BookingStatus.CANCELLED);
      fetchData();
    }
  };

  const cancelRoom = async (id: string) => {
    if (confirm('Cancel stay?')) {
      await api.updateRoomStatus(id, BookingStatus.CANCELLED);
      fetchData();
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED: return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Confirmed</span>;
      case BookingStatus.CANCELLED: return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Cancelled</span>;
      default: return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending</span>;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen animate-pulse font-bold tracking-widest text-slate-400">LOADING GUEST PROFILE...</div>;

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-slate-900">Namaste, {user?.name}</h1>
          <p className="text-slate-500 mt-2">Welcome to your Himalayan Crown portal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center text-amber-600"><ChefHat className="mr-2" /> Dining History</h2>
            {tableBookings.length === 0 ? (
              <p className="text-slate-400 italic">No dining bookings found.</p>
            ) : tableBookings.map(b => (
              <div key={b.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">{b.id}</p>
                  <h4 className="text-xl font-bold mt-1">{b.date}</h4>
                  <p className="text-slate-500 text-sm">{b.time} • {b.guests} Guests</p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  {getStatusBadge(b.status)}
                  {b.status === BookingStatus.PENDING && <button onClick={() => cancelTable(b.id)} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Cancel</button>}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center text-blue-600"><Bed className="mr-2" /> Stay History</h2>
            {roomBookings.length === 0 ? (
              <p className="text-slate-400 italic">No stay bookings found.</p>
            ) : roomBookings.map(b => (
              <div key={b.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">{b.id}</p>
                  <h4 className="text-xl font-bold mt-1">{b.roomTypeName}</h4>
                  <p className="text-slate-500 text-sm">{b.checkIn} to {b.checkOut}</p>
                  <p className="text-lg font-bold mt-3">${b.totalPrice}</p>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  {getStatusBadge(b.status)}
                  {b.status === BookingStatus.PENDING && <button onClick={() => cancelRoom(b.id)} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Cancel</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'rooms' | 'bookings-t' | 'bookings-r' | 'users' | 'images' | 'system'>('overview');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [tables, setTables] = useState<TableBooking[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailTestResult, setEmailTestResult] = useState<{success?: boolean, message?: string} | null>(null);
  const [testEmail, setTestEmail] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    const [m, r, t, rb, u, s] = await Promise.all([
      api.getMenu(),
      api.getRoomTypes(),
      api.getAllTableBookings(),
      api.getAllRoomBookings(),
      api.getAllUsers(),
      api.getAdminStats()
    ]);
    setMenu(m);
    setRooms(r);
    setTables(t.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setRoomBookings(rb.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setUsers(u);
    setStats(s);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatusUpdate = async (type: 'table' | 'room', id: string, status: BookingStatus) => {
    if (type === 'table') await api.updateTableStatus(id, status);
    else await api.updateRoomStatus(id, status);
    fetchAll();
  };

  const deleteMenuItem = async (id: string) => {
    if (confirm('Delete recipe?')) {
      await api.deleteMenu(id);
      fetchAll();
    }
  };

  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoomBookings = roomBookings.filter(rb => 
    rb.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || rb.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date().toISOString().split('T')[0];
  const todaysArrivals = [
    ...tables.filter(t => t.date === today && t.status === BookingStatus.CONFIRMED).map(t => ({ ...t, type: 'Dining' })),
    ...roomBookings.filter(r => r.checkIn === today && r.status === BookingStatus.CONFIRMED).map(r => ({ ...r, type: 'Stay' }))
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen font-bold tracking-[0.3em] text-slate-400">INITIALIZING COMMAND CENTER...</div>;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
          <div className="flex items-center space-x-4">
             <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl">
               <ShieldCheck size={32} />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-slate-900">Management Console</h1>
               <p className="text-slate-400 text-sm font-medium">Hotel Himalayan Crown Systems</p>
             </div>
          </div>
          
          {/* Quick Actions Alert */}
          {(stats?.pendingTables > 0 || stats?.pendingRooms > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center space-x-3">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Action Required</p>
                <p className="text-xs text-amber-600">
                  {stats?.pendingTables > 0 && `${stats.pendingTables} dining`}
                  {stats?.pendingTables > 0 && stats?.pendingRooms > 0 && ' & '}
                  {stats?.pendingRooms > 0 && `${stats.pendingRooms} room`} 
                  {(stats?.pendingTables + stats?.pendingRooms) > 1 ? ' bookings' : ' booking'} pending approval
                </p>
              </div>
              <button 
                onClick={() => setActiveTab(stats?.pendingTables > 0 ? 'bookings-t' : 'bookings-r')}
                className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                Review Now
              </button>
            </div>
          )}
          
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto max-w-full">
            <button onClick={() => {setActiveTab('overview'); setSearchQuery('');}} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Overview</button>
            <button onClick={() => {setActiveTab('bookings-t'); setSearchQuery('');}} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${activeTab === 'bookings-t' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              Dining 
              {stats?.pendingTables > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingTables}
                </span>
              )}
            </button>
            <button onClick={() => {setActiveTab('bookings-r'); setSearchQuery('');}} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${activeTab === 'bookings-r' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              Stays
              {stats?.pendingRooms > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingRooms}
                </span>
              )}
            </button>
            <button onClick={() => setActiveTab('users')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Guest Registry</button>
            <button onClick={() => setActiveTab('menu')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'menu' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Menu</button>
            <button onClick={() => setActiveTab('images')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'images' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>Images</button>
            <button onClick={() => setActiveTab('system')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'system' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>System</button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-3xl"><TrendingUp size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">${stats?.totalRevenue}</h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-3xl"><Activity size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrivals Today</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{todaysArrivals.length} Guests</h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
                <div className="bg-amber-100 text-amber-600 p-4 rounded-3xl"><Clock size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Requests</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.pendingTables + stats?.pendingRooms} Actions</h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
                <div className="bg-purple-100 text-purple-600 p-4 rounded-3xl"><UsersIcon size={24}/></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Guests</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.totalGuests} Members</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 flex items-center"><Calendar className="mr-2 text-blue-500" /> Today's Arrivals Log</h2>
              {todaysArrivals.length === 0 ? (
                <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[2rem]">
                  No guest arrivals scheduled for today
                </div>
              ) : (
                <div className="space-y-4">
                  {todaysArrivals.map((arrival: any) => (
                    <div key={arrival.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center space-x-6">
                        <div className={`p-3 rounded-2xl ${arrival.type === 'Dining' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                          {arrival.type === 'Dining' ? <ChefHat size={20}/> : <Bed size={20}/>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{arrival.name || arrival.guestName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{arrival.type} Booking • {arrival.time || arrival.roomTypeName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase">Arrival Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center"><Activity size={24} className="mr-2 text-green-500" /> Recent Dining Bookings</h2>
                {tables.slice(0, 5).length === 0 ? (
                  <p className="text-slate-400 italic text-center py-8">No recent bookings</p>
                ) : (
                  <div className="space-y-4">
                    {tables.slice(0, 5).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-xl ${booking.status === BookingStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-600' : booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <ChefHat size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{booking.name}</p>
                            <p className="text-xs text-slate-500">{booking.date} • {booking.guests} guests</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === BookingStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-700' : booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center"><Bed size={24} className="mr-2 text-blue-500" /> Recent Room Bookings</h2>
                {roomBookings.slice(0, 5).length === 0 ? (
                  <p className="text-slate-400 italic text-center py-8">No recent bookings</p>
                ) : (
                  <div className="space-y-4">
                    {roomBookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-xl ${booking.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-600' : booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <Bed size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{booking.guestName}</p>
                            <p className="text-xs text-slate-500">{booking.roomTypeName} • ${booking.totalPrice}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-700' : booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* BOOKINGS VIEW */}
        {(activeTab === 'bookings-t' || activeTab === 'bookings-r') && (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-bold">{activeTab === 'bookings-t' ? 'Dining Audit' : 'Stay Audit'}</h2>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search by Guest Name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 w-80 outline-none shadow-sm"
                />
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Info</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Details</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeTab === 'bookings-t' ? (
                    filteredTables.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-900">{b.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{b.mobile}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-slate-700">{b.date} • {b.time}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{b.guests} Guests • Ref: {b.id}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${b.status === BookingStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-700' : b.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                             {b.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           {b.status === BookingStatus.PENDING && (
                             <div className="flex justify-end space-x-2">
                               <button onClick={() => handleStatusUpdate('table', b.id, BookingStatus.CONFIRMED)} className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"><CheckCircle2 size={16}/></button>
                               <button onClick={() => handleStatusUpdate('table', b.id, BookingStatus.CANCELLED)} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"><XCircle size={16}/></button>
                             </div>
                           )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredRoomBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-900">{b.guestName}</p>
                           <p className="text-[10px] text-slate-400 font-medium">{b.guestEmail}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-bold text-slate-700">{b.roomTypeName}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{b.checkIn} to {b.checkOut} • ${b.totalPrice}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${b.status === BookingStatus.CONFIRMED ? 'bg-blue-100 text-blue-700' : b.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                             {b.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           {b.status === BookingStatus.PENDING && (
                             <div className="flex justify-end space-x-2">
                               <button onClick={() => handleStatusUpdate('room', b.id, BookingStatus.CONFIRMED)} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><CheckCircle2 size={16}/></button>
                               <button onClick={() => handleStatusUpdate('room', b.id, BookingStatus.CANCELLED)} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"><XCircle size={16}/></button>
                             </div>
                           )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REGISTRY VIEW */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-bold">Guest Registry</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity / Email</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Role</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{u.name}</td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-medium">{u.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"><Edit size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MENU & ROOMS INVENTORY TABS (Basic placeholders for management) */}
        {activeTab === 'menu' && (
           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold">Culinary Inventory</h2>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-xs flex items-center uppercase tracking-widest shadow-xl"><Plus size={16} className="mr-2" /> New Recipe</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {menu.slice(0, 6).map(item => (
                   <div key={item.id} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-3xl">
                     <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" />
                     <div className="flex-1">
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">${item.price}</p>
                     </div>
                     <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                   </div>
                ))}
              </div>
           </div>
        )}

        {/* IMAGE MANAGEMENT */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center"><FileText className="mr-2 text-green-500" /> Image Management</h2>

            <div className="space-y-8">
              {/* Menu Images */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center"><ChefHat className="mr-2 text-amber-500" /> Menu Images</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Upload images for menu items. Place your image files in <code className="bg-slate-100 px-2 py-1 rounded text-xs">public/images/menu/</code> folder.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menu.slice(0, 6).map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200">
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <h4 className="font-bold text-blue-800 mb-2">How to Upload Menu Images:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Save your food photos as JPG/PNG files</li>
                    <li>Name them like: <code>kullu-siddu.jpg</code>, <code>butter-chicken.jpg</code></li>
                    <li>Place them in <code>public/images/menu/</code> folder</li>
                    <li>Update the image paths in menu items to use local paths</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>

              {/* Room Images */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center"><Bed className="mr-2 text-blue-500" /> Room Images</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Upload images for hotel rooms. Place your image files in <code className="bg-slate-100 px-2 py-1 rounded text-xs">public/images/rooms/</code> folder.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.slice(0, 6).map(room => (
                    <div key={room.id} className="bg-white p-4 rounded-2xl border border-slate-200">
                      <img src={room.image} alt={room.type} className="w-full h-32 object-cover rounded-xl mb-3" />
                      <p className="text-sm font-bold text-slate-900">{room.type}</p>
                      <p className="text-xs text-slate-500">${room.pricePerNight}/night</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <h4 className="font-bold text-green-800 mb-2">How to Upload Room Images:</h4>
                  <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                    <li>Take photos of your hotel rooms</li>
                    <li>Name them like: <code>classic-heritage-101.jpg</code>, <code>deluxe-oasis-102.jpg</code></li>
                    <li>Place them in <code>public/images/rooms/</code> folder</li>
                    <li>Update room image paths to use local paths</li>
                    <li>Images will appear in the Rooms section</li>
                  </ol>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center"><Mountain className="mr-2 text-purple-500" /> Gallery Images</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Upload images for the photo gallery. Place your image files in <code className="bg-slate-100 px-2 py-1 rounded text-xs">public/images/gallery/</code> folder.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GALLERY_IMAGE_IDS.map(id => (
                    <div key={id} className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                      <img src={`https://images.unsplash.com/photo-${id}?q=80&w=300&auto=format&fit=crop`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                  <h4 className="font-bold text-purple-800 mb-2">How to Upload Gallery Images:</h4>
                  <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                    <li>Take photos of your hotel exterior, views, restaurant</li>
                    <li>Name them descriptively: <code>mountain-view.jpg</code>, <code>hotel-exterior.jpg</code></li>
                    <li>Place them in <code>public/images/gallery/</code> folder</li>
                    <li>Update gallery to use local images instead of Unsplash</li>
                    <li>Images will appear in the Gallery page</li>
                  </ol>
                </div>
              </div>

              {/* File Upload Simulation */}
              <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200">
                <h3 className="text-lg font-bold mb-6 flex items-center text-amber-800"><Send className="mr-2" /> Upload Instructions</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-amber-100">
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Manual File Upload</p>
                      <p className="text-sm text-slate-600">Since this is a static website, upload images by placing files in the public folder manually.</p>
                    </div>
                  </div>
                  <div className="text-sm text-amber-700 space-y-2">
                    <p><strong>Step 1:</strong> Open your project folder in File Explorer</p>
                    <p><strong>Step 2:</strong> Navigate to <code>public/images/</code> subfolders</p>
                    <p><strong>Step 3:</strong> Copy your image files into the appropriate folders</p>
                    <p><strong>Step 4:</strong> Update the image paths in the code if needed</p>
                    <p><strong>Step 5:</strong> Refresh the website to see your images</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM SETTINGS */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center"><Mail className="mr-2 text-blue-500" /> System Configuration</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Email Configuration */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center"><Mail className="mr-2 text-amber-500" /> Email Service Setup</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Service ID</label>
                    <input
                      type="text"
                      value={import.meta.env.VITE_EMAILJS_SERVICE_ID || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                      placeholder="Not configured"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Template ID</label>
                    <input
                      type="text"
                      value={import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                      placeholder="Not configured"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Public Key</label>
                    <input
                      type="password"
                      value={import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm"
                      placeholder="Not configured"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-amber-800 font-medium">
                    ⚠️ EmailJS credentials are not configured. Update your <code className="bg-amber-100 px-2 py-1 rounded text-xs">.env.local</code> file with real EmailJS credentials.
                  </p>
                </div>

                <button
                  onClick={() => window.open('https://dashboard.emailjs.com/', '_blank')}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Open EmailJS Dashboard
                </button>
              </div>

              {/* Email Testing */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-lg font-bold mb-6 flex items-center"><Send className="mr-2 text-green-500" /> Test Email Service</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Test Email Address</label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setEmailTestResult(null);
                    try {
                      const result = await api.testEmailSetup(testEmail || undefined);
                      setEmailTestResult(result);
                    } catch (error) {
                      setEmailTestResult({ success: false, message: `Test failed: ${error.message}` });
                    }
                  }}
                  className="w-full bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors mb-4"
                >
                  Send Test Email
                </button>

                {emailTestResult && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${emailTestResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {emailTestResult.success ? '✅' : '❌'} {emailTestResult.message}
                  </div>
                )}

                <div className="mt-6 text-xs text-slate-500 space-y-2">
                  <p><strong>Troubleshooting:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your spam/junk folder</li>
                    <li>Verify EmailJS credentials in .env.local</li>
                    <li>Ensure email service is connected in EmailJS</li>
                    <li>Check browser console for detailed errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await api.register(name, email, '123456');
        alert('Heritage account created!');
        setIsRegister(false);
      } else {
        const user = await api.login(email);
        setUser(user);
        navigate(user.role === UserRole.ADMIN ? '/admin' : '/');
      }
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100">
        <div className="bg-slate-950 p-12 text-center text-white">
          <div className="flex justify-center mb-6"><Logo light /></div>
          <h2 className="text-3xl font-bold mb-2 font-serif">{isRegister ? 'Join the Heritage' : 'Welcome Back'}</h2>
        </div>
        <div className="p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {isRegister && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
              <p className="text-[10px] text-slate-400 mt-4 italic">* Management Access: admin@himalayancrown.com</p>
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl mt-4">
              {loading ? 'Authenticating...' : isRegister ? 'Register' : 'Guest Login'}
            </button>
          </form>
          <div className="mt-10 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-amber-600 font-bold text-xs uppercase tracking-widest hover:underline">
              {isRegister ? 'Login' : 'Join Us'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: UserRole }> = ({ children, role }) => {
  const { user, loading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (!loading && user && role && user.role !== role) navigate('/');
  }, [user, loading]);

  if (loading) return null;
  return user ? <>{children}</> : null;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/about" element={<div className="py-32 bg-white"><div className="max-w-4xl mx-auto px-4 text-center"><span className="text-amber-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Our Legend</span><h1 className="text-6xl font-bold mb-10 font-serif">Hotel Himalayan Crown</h1><p className="text-xl text-slate-500 font-light leading-relaxed">Nestled in the pristine peaks since 1920, Hotel Himalayan Crown carries a legacy of elevated hospitality, blending timeless mountain heritage with modern luxury comforts.</p></div></div>} />
              <Route path="/gallery" element={<div className="py-32 bg-slate-50"><h1 className="text-5xl font-bold text-center mb-16 font-serif">The Himalayan Vista</h1><div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">{GALLERY_IMAGE_IDS.map(id => <div key={id} className="aspect-square rounded-3xl overflow-hidden shadow-lg group"><img src={`https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" /></div>)}</div></div>} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role={UserRole.ADMIN}><AdminPanel /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;