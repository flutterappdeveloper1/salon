import React, { useState } from 'react';
import { User, Role, Booking, Withdrawal, BookingStatus, WithdrawalStatus, Salon, Service } from './types';
import LoginScreen from './screens/LoginScreen';
import CustomerDashboard from './screens/CustomerDashboard';
import VendorDashboard from './screens/VendorDashboard';
import AdminDashboard from './screens/AdminDashboard';
import { mockUsers, mockBookings, mockWithdrawals, mockSalons } from './data/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [salons, setSalons] = useState<Salon[]>(mockSalons);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- State Management Handlers ---

  const handleVendorApproval = (vendorId: string, approve: boolean) => {
    setUsers(users.map(u => u.uid === vendorId ? { ...u, approved: approve } : u));
    alert(`Vendor ${approve ? 'approved' : 'rejected'} successfully.`);
  };

  const handleBookingStatusChange = (bookingId: string, status: BookingStatus) => {
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    setBookings(bookings.map(b => b.bookingId === bookingId ? { ...b, status } : b));

    if (status === BookingStatus.COMPLETED) {
      // Simulate cloud function: update vendor balance
      const vendorFee = 1; // Example fee
      setUsers(users.map(u => u.uid === booking.vendorId ? { ...u, balance: u.balance + booking.price - vendorFee } : u));
      alert(`Booking marked as completed. Vendor's balance updated.`);
    }
  };
  
  const handleWithdrawalAction = (withdrawId: string, status: WithdrawalStatus) => {
    const withdrawal = withdrawals.find(w => w.withdrawId === withdrawId);
     if (!withdrawal) return;

    setWithdrawals(withdrawals.map(w => w.withdrawId === withdrawId ? { ...w, status } : w));
    
    if (status === WithdrawalStatus.APPROVED) {
      // Simulate transferring money and updating balance
      setUsers(users.map(u => u.uid === withdrawal.vendorId ? { ...u, balance: u.balance - withdrawal.amount } : u));
      alert(`Withdrawal approved. Vendor's balance updated.`);
    } else {
       alert(`Withdrawal rejected.`);
    }
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    alert(`Booking for ${newBooking.service} was successful!`);
  };

  const handleAddWithdrawal = (newWithdrawal: Withdrawal) => {
    setWithdrawals(prev => [newWithdrawal, ...prev]);
    alert(`Withdrawal request for ${newWithdrawal.amount}৳ submitted successfully. Fee: ${newWithdrawal.fee}৳.`);
  };

  const handleUpdateSalon = (updatedSalon: Salon) => {
    setSalons(salons.map(s => s.vendorId === updatedSalon.vendorId ? updatedSalon : s));
  };
  
  const handleUpdateServices = (vendorId: string, newServices: Service[]) => {
    setSalons(salons.map(s => s.vendorId === vendorId ? { ...s, services: newServices } : s));
  };


  const renderDashboard = () => {
    if (!currentUser) return null;
    
    // Always get the latest user data from the state
    const latestUserData = users.find(u => u.uid === currentUser.uid) || currentUser;

    switch (latestUserData.role) {
      case Role.CUSTOMER:
        return <CustomerDashboard user={latestUserData} onLogout={handleLogout} bookings={bookings} onAddBooking={handleAddBooking} salons={salons} users={users} />;
      case Role.VENDOR:
        return <VendorDashboard user={latestUserData} onLogout={handleLogout} bookings={bookings} withdrawals={withdrawals} onAddWithdrawal={handleAddWithdrawal} salon={salons.find(s => s.vendorId === latestUserData.uid)!} onUpdateSalon={handleUpdateSalon} onUpdateServices={handleUpdateServices} />;
      case Role.ADMIN:
        return <AdminDashboard 
                    user={latestUserData} 
                    onLogout={handleLogout}
                    users={users}
                    bookings={bookings}
                    withdrawals={withdrawals}
                    onVendorApproval={handleVendorApproval}
                    onBookingStatusChange={handleBookingStatusChange}
                    onWithdrawalAction={handleWithdrawalAction}
                />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {currentUser ? renderDashboard() : <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

export default App;