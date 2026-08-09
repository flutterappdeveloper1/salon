
import React, { useState } from 'react';
import { User, Booking, Withdrawal, Role, BookingStatus, WithdrawalStatus } from '../types';
import Header from '../components/Header';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  users: User[];
  bookings: Booking[];
  withdrawals: Withdrawal[];
  onVendorApproval: (vendorId: string, approve: boolean) => void;
  onBookingStatusChange: (bookingId: string, status: BookingStatus) => void;
  onWithdrawalAction: (withdrawId: string, status: WithdrawalStatus) => void;
}

type Tab = 'vendors' | 'bookings' | 'withdrawals';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    user, 
    onLogout, 
    users, 
    bookings, 
    withdrawals,
    onVendorApproval,
    onBookingStatusChange,
    onWithdrawalAction
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('vendors');

  // State for booking filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State for sorting
  const [sortOption, setSortOption] = useState('timestamp-desc');

  const TabButton: React.FC<{tabId: Tab; children: React.ReactNode}> = ({tabId, children}) => (
    <button onClick={() => setActiveTab(tabId)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${activeTab === tabId ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
        {children}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'vendors':
        return (
          <div className="space-y-4">
            {users.filter(u => u.role === Role.VENDOR).map(vendor => (
              <div key={vendor.uid} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold">{vendor.name}</p>
                  <p className="text-sm text-gray-600">{vendor.email}</p>
                </div>
                <div>
                  {vendor.approved === undefined || !vendor.approved ? (
                    <div className="flex space-x-2">
                      <button onClick={() => onVendorApproval(vendor.uid, true)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                      <button onClick={() => onVendorApproval(vendor.uid, false)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                    </div>
                  ) : <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">Approved</span>}
                </div>
              </div>
            ))}
          </div>
        );
      case 'bookings':
        const filteredBookings = bookings.filter(booking => {
            // Status filter
            if (bookingStatusFilter !== 'ALL' && booking.status !== bookingStatusFilter) {
                return false;
            }

            // Date range filter
            const bookingDate = new Date(booking.timestamp);
            bookingDate.setHours(0, 0, 0, 0); // Normalize to start of the day
            const bookingDayTimestamp = bookingDate.getTime();

            if (startDate) {
                const [year, month, day] = startDate.split('-').map(Number);
                const filterStartDate = new Date(year, month - 1, day);
                if (bookingDayTimestamp < filterStartDate.getTime()) {
                    return false;
                }
            }

            if (endDate) {
                const [year, month, day] = endDate.split('-').map(Number);
                const filterEndDate = new Date(year, month - 1, day);
                if (bookingDayTimestamp > filterEndDate.getTime()) {
                    return false;
                }
            }

            return true;
        });

        const sortedBookings = [...filteredBookings].sort((a, b) => {
            const [key, direction] = sortOption.split('-');

            if (key === 'timestamp') {
                return direction === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
            }
            if (key === 'status') {
                // 'desc' will put PENDING first, 'asc' will put COMPLETED first
                return direction === 'desc' ? b.status.localeCompare(a.status) : a.status.localeCompare(b.status);
            }
            return 0;
        });

        return (
           <div>
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center">
                    <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                    <select
                        id="statusFilter"
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value as BookingStatus | 'ALL')}
                        className="w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="ALL">All</option>
                        <option value={BookingStatus.PENDING}>Pending</option>
                        <option value={BookingStatus.COMPLETED}>Completed</option>
                    </select>
                </div>

                <div className="flex items-center">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mr-2">From:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mr-2">To:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>

                <div className="flex items-center">
                    <label htmlFor="sortOption" className="text-sm font-medium text-gray-700 mr-2">Sort By:</label>
                    <select
                        id="sortOption"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="timestamp-desc">Date (Newest First)</option>
                        <option value="timestamp-asc">Date (Oldest First)</option>
                        <option value="status-desc">Status (Pending First)</option>
                        <option value="status-asc">Status (Completed First)</option>
                    </select>
                </div>
                
                <button 
                    onClick={() => {
                        setBookingStatusFilter('ALL');
                        setStartDate('');
                        setEndDate('');
                        setSortOption('timestamp-desc');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition duration-150"
                >
                    Clear
                </button>
            </div>
            <div className="space-y-4">
              {sortedBookings.length > 0 ? sortedBookings.map(booking => {
                const customer = users.find(u => u.uid === booking.buyerId);
                const vendor = users.find(u => u.uid === booking.vendorId);
                return (
                   <div key={booking.bookingId} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{booking.service} ({booking.price}৳)</p>
                        <p className="text-sm text-gray-600">Customer: {customer?.name} | Vendor: {vendor?.name}</p>
                        <p className="text-xs text-gray-500">Date: {new Date(booking.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div>
                        {booking.status === BookingStatus.PENDING && (
                          <button onClick={() => onBookingStatusChange(booking.bookingId, BookingStatus.COMPLETED)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Mark as Completed</button>
                        )}
                        {booking.status === BookingStatus.COMPLETED && (
                          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }) : <div className="text-center py-8"><p className="text-gray-500">No bookings match the current filters.</p></div>}
            </div>
           </div>
        );
      case 'withdrawals':
        return (
           <div className="space-y-4">
            {withdrawals.filter(w => w.status === WithdrawalStatus.PENDING).map(w => {
              const vendor = users.find(u => u.uid === w.vendorId);
              return (
                <div key={w.withdrawId} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold">{w.amount}৳ request from {vendor?.name}</p>
                    <p className="text-sm text-gray-600">Fee: {w.fee}৳ | To: {vendor?.walletType} {vendor?.walletNumber}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => onWithdrawalAction(w.withdrawId, WithdrawalStatus.APPROVED)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                    <button onClick={() => onWithdrawalAction(w.withdrawId, WithdrawalStatus.REJECTED)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Reject</button>
                  </div>
                </div>
              );
            })}
             {withdrawals.filter(w => w.status !== WithdrawalStatus.PENDING).map(w => {
                const vendor = users.find(u => u.uid === w.vendorId);
                return (
                   <div key={w.withdrawId} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between opacity-70">
                        <div>
                            <p className="font-bold">{w.amount}৳ request from {vendor?.name}</p>
                            <p className="text-sm text-gray-500">{new Date(w.timestamp).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${w.status === WithdrawalStatus.APPROVED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{w.status}</span>
                   </div>
                )
             })}
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-2" aria-label="Tabs">
              <TabButton tabId="vendors">Vendor Management</TabButton>
              <TabButton tabId="bookings">Bookings</TabButton>
              <TabButton tabId="withdrawals">Withdrawals</TabButton>
            </nav>
          </div>
          <div>{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
