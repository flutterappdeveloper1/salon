import { User, Salon, Booking, Withdrawal, Role, WalletType, BookingStatus, WithdrawalStatus } from '../types';

export let mockUsers: User[] = [
  {
    uid: 'admin01',
    name: 'Admin Shorif',
    role: Role.ADMIN,
    phone: '+8801234567890',
    email: 'ahmadshorif00001@gmail.com',
    balance: 0,
  },
  {
    uid: 'customer01',
    name: 'Jannat Doe',
    role: Role.CUSTOMER,
    phone: '+8801711111111',
    email: 'customer@example.com',
    balance: 0,
  },
  {
    uid: 'vendor01',
    name: 'Chic Cuts Salon',
    role: Role.VENDOR,
    phone: '+8801822222222',
    email: 'vendor1@example.com',
    walletType: WalletType.BKASH,
    walletNumber: '01822222222',
    balance: 750,
    approved: true,
  },
  {
    uid: 'vendor02',
    name: 'Glamour Lounge',
    role: Role.VENDOR,
    phone: '+801933333333',
    email: 'vendor2@example.com',
    walletType: WalletType.NAGAD,
    walletNumber: '01933333333',
    balance: 320,
    approved: false,
  },
];

export let mockSalons: Salon[] = [
  {
    vendorId: 'vendor01',
    name: 'Chic Cuts Salon',
    address: '123 Gulshan Ave, Dhaka',
    bannerUrl: 'https://picsum.photos/800/400?random=1',
    rating: 4.8,
    services: [
      { id: 's1', name: 'Men\'s Haircut', price: 300, imageUrl: 'https://picsum.photos/200/200?random=11', reviews: [{ reviewerName: 'Jannat', rating: 5, comment: 'Great cut!' }] },
      { id: 's2', name: 'Beard Trim', price: 150, imageUrl: 'https://picsum.photos/200/200?random=12' },
      { id: 's3', name: 'Hair Color', price: 1200, imageUrl: 'https://picsum.photos/200/200?random=13' },
    ],
  },
  {
    vendorId: 'vendor02',
    name: 'Glamour Lounge',
    address: '456 Banani Rd, Dhaka',
    bannerUrl: 'https://picsum.photos/800/400?random=2',
    rating: 4.5,
    services: [
      { id: 's4', name: 'Women\'s Haircut', price: 800, imageUrl: 'https://picsum.photos/200/200?random=21' },
      { id: 's5', name: 'Facial', price: 1500, imageUrl: 'https://picsum.photos/200/200?random=22' },
      { id: 's6', name: 'Manicure', price: 600, imageUrl: 'https://picsum.photos/200/200?random=23' },
    ],
  },
];

export const mockBookings: Booking[] = [
  {
    bookingId: 'booking01',
    buyerId: 'customer01',
    vendorId: 'vendor01',
    service: 'Men\'s Haircut',
    price: 300,
    status: BookingStatus.COMPLETED,
    paymentMethod: WalletType.BKASH,
    transactionId: 'TX12345ABC',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    bookingId: 'booking02',
    buyerId: 'customer01',
    vendorId: 'vendor01',
    service: 'Beard Trim',
    price: 150,
    status: BookingStatus.PENDING,
    paymentMethod: WalletType.NAGAD,
    transactionId: 'TX67890DEF',
    timestamp: Date.now() - 86400000,
  },
];

export const mockWithdrawals: Withdrawal[] = [
  {
    withdrawId: 'wd01',
    vendorId: 'vendor01',
    amount: 500,
    fee: 5,
    status: WithdrawalStatus.PENDING,
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    withdrawId: 'wd02',
    vendorId: 'vendor01',
    amount: 1000,
    fee: 10,
    status: WithdrawalStatus.APPROVED,
    timestamp: Date.now() - 86400000 * 5,
  },
];