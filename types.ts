export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface RoomType {
  id: string;
  type: string;
  pricePerNight: number;
  image: string;
  capacity: number;
  description: string;
  amenities: string[];
}

export interface TableBooking {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  date: string;
  time: string;
  guests: number;
  tableNo?: number;
  status: BookingStatus;
  createdAt: string;
}

export interface RoomBooking {
  id: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  roomTypeId: string;
  roomTypeName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomsCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}