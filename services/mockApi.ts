import { 
  User, 
  UserRole, 
  TableBooking, 
  RoomBooking, 
  BookingStatus,
  MenuItem,
  RoomType 
} from '../types';
import { INITIAL_MENU, INITIAL_ROOMS } from './mockData';
import emailjs from '@emailjs/browser';

// Helper to simulate DB Delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockApiService {
  private users: User[] = JSON.parse(localStorage.getItem('hhc_users') || '[]');
  private menu: MenuItem[] = JSON.parse(localStorage.getItem('hhc_menu') || JSON.stringify(INITIAL_MENU));
  private roomTypes: RoomType[] = JSON.parse(localStorage.getItem('hhc_roomTypes') || JSON.stringify(INITIAL_ROOMS));
  private tableBookings: TableBooking[] = JSON.parse(localStorage.getItem('hhc_table_bookings') || '[]');
  private roomBookings: RoomBooking[] = JSON.parse(localStorage.getItem('hhc_room_bookings') || '[]');
  private currentUser: User | null = JSON.parse(localStorage.getItem('hhc_current_user') || 'null');

  constructor() {
    // Seed Admin User
    if (this.users.length === 0) {
      this.users.push({
        id: 'admin-1',
        name: 'Royal Concierge',
        email: 'admin@himalayancrown.com',
        role: UserRole.ADMIN
      });
      
      // Seed some dummy guests
      const guests = [
        { id: 'u1', name: 'Arjun Sharma', email: 'arjun@example.com', role: UserRole.USER },
        { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: UserRole.USER },
        { id: 'u3', name: 'Vikram Singh', email: 'vikram@example.com', role: UserRole.USER }
      ];
      this.users.push(...guests);

      // Seed Dummy Table Bookings
      const today = new Date().toISOString().split('T')[0];
      if (this.tableBookings.length === 0) {
        this.tableBookings = [
          { id: 'HTC-A1B2', userId: 'u1', name: 'Arjun Sharma', mobile: '+91 98765 43210', date: today, time: '19:30', guests: 4, status: BookingStatus.CONFIRMED, createdAt: new Date().toISOString() },
          { id: 'HTC-C3D4', userId: 'u2', name: 'Priya Patel', mobile: '+91 99988 77766', date: today, time: '20:00', guests: 2, status: BookingStatus.PENDING, createdAt: new Date().toISOString() },
          { id: 'HTC-E5F6', userId: 'u3', name: 'Vikram Singh', mobile: '+91 88877 66655', date: '2024-12-25', time: '13:00', guests: 6, status: BookingStatus.CONFIRMED, createdAt: new Date().toISOString() }
        ];
      }

      // Seed Dummy Room Bookings
      if (this.roomBookings.length === 0) {
        this.roomBookings = [
          { id: 'HRC-R1S2', userId: 'u1', guestName: 'Arjun Sharma', guestEmail: 'arjun@example.com', roomTypeId: 'room-1', roomTypeName: 'Classic Heritage 101', checkIn: today, checkOut: '2024-12-24', nights: 3, roomsCount: 1, totalPrice: 600, status: BookingStatus.CONFIRMED, createdAt: new Date().toISOString() },
          { id: 'HRC-T3U4', userId: 'u2', guestName: 'Priya Patel', guestEmail: 'priya@example.com', roomTypeId: 'room-5', roomTypeName: 'Presidential Sky Villa 105', checkIn: '2024-12-30', checkOut: '2025-01-02', nights: 3, roomsCount: 1, totalPrice: 1200, status: BookingStatus.PENDING, createdAt: new Date().toISOString() }
        ];
      }

      this.save();
    }
  }

  private save() {
    localStorage.setItem('hhc_users', JSON.stringify(this.users));
    localStorage.setItem('hhc_menu', JSON.stringify(this.menu));
    localStorage.setItem('hhc_roomTypes', JSON.stringify(this.roomTypes));
    localStorage.setItem('hhc_table_bookings', JSON.stringify(this.tableBookings));
    localStorage.setItem('hhc_room_bookings', JSON.stringify(this.roomBookings));
    localStorage.setItem('hhc_current_user', JSON.stringify(this.currentUser));
  }

  private async sendEmail(to: string, subject: string, templateId: string, templateParams: any) {
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !publicKey || serviceId === 'your_service_id' || publicKey === 'your_public_key') {
        console.warn('⚠️ EmailJS not configured properly. Please set up your EmailJS account and update .env.local with real credentials.');
        console.log('📧 Email would be sent to:', to);
        console.log('📧 Subject:', subject);
        console.log('📧 Template Params:', templateParams);
        return;
      }

      console.log('📧 Sending email via EmailJS...', { to, subject, serviceId, templateId });

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: to,
          subject: subject,
          ...templateParams
        },
        publicKey
      );

      console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      console.error('❌ EmailJS Error Details:', {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: templateId,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        to: to,
        error: error
      });
      throw error;
    }
  }

  private async sendTableBookingEmail(booking: TableBooking, userEmail: string) {
    const templateParams = {
      guest_name: booking.name,
      booking_id: booking.id,
      booking_date: booking.date,
      booking_time: booking.time,
      guests: booking.guests,
      table_number: booking.tableNo || 'To be assigned',
      status: booking.status,
      hotel_name: 'Hotel Himalayan Crown',
      contact_email: 'reservations@himalayancrown.com',
      contact_phone: '+91 7876812345'
    };

    await this.sendEmail(
      userEmail,
      `Table Reservation ${booking.status} - ${booking.id}`,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
  }

  private async sendRoomBookingEmail(booking: RoomBooking, userEmail: string) {
    const templateParams = {
      guest_name: booking.guestName,
      booking_id: booking.id,
      room_type: booking.roomTypeName,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      nights: booking.nights,
      rooms_count: booking.roomsCount,
      total_price: `₹${booking.totalPrice.toLocaleString()}`,
      status: booking.status,
      hotel_name: 'Hotel Himalayan Crown',
      contact_email: 'reservations@himalayancrown.com',
      contact_phone: '+91 7876812345'
    };

    await this.sendEmail(
      userEmail,
      `Room Reservation ${booking.status} - ${booking.id}`,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
  }

  // Auth
  async register(name: string, email: string, password: string): Promise<User> {
    await delay(500);
    const existing = this.users.find(u => u.email === email);
    if (existing) throw new Error("Email already registered");
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: (email.includes('admin') || email.includes('himalayancrown.com')) ? UserRole.ADMIN : UserRole.USER
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  async login(email: string): Promise<User> {
    await delay(500);
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error("User not found");
    this.currentUser = user;
    this.save();
    return user;
  }

  logout() {
    this.currentUser = null;
    this.save();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async getAllUsers() {
    return this.users;
  }

  // Menu Management
  async getMenu() { return this.menu; }
  async addMenu(item: Omit<MenuItem, 'id'>) {
    const newItem = { ...item, id: Date.now().toString() };
    this.menu.push(newItem);
    this.save();
    return newItem;
  }
  async updateMenu(id: string, data: Partial<MenuItem>) {
    this.menu = this.menu.map(m => m.id === id ? { ...m, ...data } : m);
    this.save();
  }
  async deleteMenu(id: string) {
    this.menu = this.menu.filter(m => m.id !== id);
    this.save();
  }

  // Room Management
  async getRoomTypes() { return this.roomTypes; }
  async addRoomType(room: Omit<RoomType, 'id'>) {
    const newRoom = { ...room, id: Date.now().toString() };
    this.roomTypes.push(newRoom);
    this.save();
    return newRoom;
  }
  async updateRoomType(id: string, data: Partial<RoomType>) {
    this.roomTypes = this.roomTypes.map(r => r.id === id ? { ...r, ...data } : r);
    this.save();
  }
  async deleteRoomType(id: string) {
    this.roomTypes = this.roomTypes.filter(r => r.id !== id);
    this.save();
  }

  // Bookings
  async bookTable(booking: Omit<TableBooking, 'id' | 'status' | 'createdAt'>) {
    const newBooking: TableBooking = {
      ...booking,
      id: 'HTC-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: BookingStatus.PENDING,
      tableNo: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date().toISOString()
    };
    this.tableBookings.push(newBooking);
    this.save();

    const user = this.users.find(u => u.id === booking.userId);
    const userEmail = user?.email || "guest@example.com";
    
    try {
      await this.sendTableBookingEmail(newBooking, userEmail);
    } catch (error) {
      console.error('Failed to send table booking email:', error);
    }

    return newBooking;
  }

  async bookRoom(booking: Omit<RoomBooking, 'id' | 'status' | 'createdAt' | 'guestName' | 'guestEmail'>) {
    const user = this.users.find(u => u.id === booking.userId);
    const newBooking: RoomBooking = {
      ...booking,
      guestName: user?.name || 'Guest',
      guestEmail: user?.email || 'N/A',
      id: 'HRC-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    this.roomBookings.push(newBooking);
    this.save();

    const userEmail = user?.email || "guest@example.com";
    
    try {
      await this.sendRoomBookingEmail(newBooking, userEmail);
    } catch (error) {
      console.error('Failed to send room booking email:', error);
    }

    return newBooking;
  }

  async testEmailSetup(testEmail?: string) {
    const testRecipient = testEmail || 'test@example.com';
    console.log('🧪 Testing EmailJS setup...');

    try {
      await this.sendEmail(
        testRecipient,
        'EmailJS Test - Hotel Himalayan Crown',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          guest_name: 'Test User',
          booking_id: 'TEST-123',
          subject: 'EmailJS Test - Hotel Himalayan Crown',
          hotel_name: 'Hotel Himalayan Crown',
          contact_email: 'test@himalayancrown.com',
          contact_phone: '+91 123 456 7890'
        }
      );
      return { success: true, message: `Test email sent to ${testRecipient}. Check your inbox and spam folder!` };
    } catch (error) {
      return { success: false, message: `Email test failed: ${error.message}`, error };
    }
  }

  async getUserTableBookings(userId: string) {
    return this.tableBookings.filter(b => b.userId === userId);
  }

  async getUserRoomBookings(userId: string) {
    return this.roomBookings.filter(b => b.userId === userId);
  }

  async getAllTableBookings() { return this.tableBookings; }
  async getAllRoomBookings() { return this.roomBookings; }

  async getAdminStats() {
    const totalRevenue = this.roomBookings
      .filter(b => b.status === BookingStatus.CONFIRMED)
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    return {
      totalRevenue,
      pendingTables: this.tableBookings.filter(b => b.status === BookingStatus.PENDING).length,
      pendingRooms: this.roomBookings.filter(b => b.status === BookingStatus.PENDING).length,
      totalGuests: this.users.length
    };
  }

  async updateTableStatus(id: string, status: BookingStatus) {
    const booking = this.tableBookings.find(b => b.id === id);
    if (!booking) return;

    this.tableBookings = this.tableBookings.map(b => b.id === id ? { ...b, status } : b);
    this.save();

    // Send confirmation email when status changes to confirmed
    if (status === BookingStatus.CONFIRMED) {
      const user = this.users.find(u => u.id === booking.userId);
      const userEmail = user?.email || "guest@example.com";
      
      try {
        await this.sendTableBookingEmail({ ...booking, status }, userEmail);
      } catch (error) {
        console.error('Failed to send table confirmation email:', error);
      }
    }
  }

  async updateRoomStatus(id: string, status: BookingStatus) {
    const booking = this.roomBookings.find(b => b.id === id);
    if (!booking) return;

    this.roomBookings = this.roomBookings.map(b => b.id === id ? { ...b, status } : b);
    this.save();

    // Send confirmation email when status changes to confirmed
    if (status === BookingStatus.CONFIRMED) {
      const user = this.users.find(u => u.id === booking.userId);
      const userEmail = user?.email || "guest@example.com";
      
      try {
        await this.sendRoomBookingEmail({ ...booking, status }, userEmail);
      } catch (error) {
        console.error('Failed to send room confirmation email:', error);
      }
    }
  }
}

export const api = new MockApiService();