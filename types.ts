export enum Role {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

export enum WalletType {
  BKASH = 'Bkash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  uid: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  walletType?: WalletType;
  walletNumber?: string;
  bankAccount?: string;
  balance: number;
  approved?: boolean; // For vendors
}

export interface Review {
    reviewerName: string;
    rating: number; // 1 to 5
    comment: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  reviews?: Review[];
}

export interface Salon {
  vendorId: string;
  name: string;
  address: string;
  bannerUrl: string;
  services: Service[];
  rating?: number; // Average rating
}

export interface Booking {
  bookingId: string;
  buyerId: string;
  vendorId: string;
  service: string;
  price: number;
  status: BookingStatus;
  paymentMethod: WalletType;
  transactionId: string;
  timestamp: number;
}

export interface Withdrawal {
  withdrawId: string;
  vendorId: string;
  amount: number;
  fee: number;
  status: WithdrawalStatus;
  timestamp: number;
}