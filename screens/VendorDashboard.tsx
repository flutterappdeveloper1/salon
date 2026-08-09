import React, { useState, useEffect } from 'react';
import { User, Booking, Withdrawal, BookingStatus, WithdrawalStatus, Salon, Service } from '../types';
import { mockUsers } from '../data/mockData';
import Header from '../components/Header';

interface VendorDashboardProps {
  user: User;
  onLogout: () => void;
  bookings: Booking[];
  withdrawals: Withdrawal[];
  onAddWithdrawal: (withdrawal: Withdrawal) => void;
  salon: Salon;
  onUpdateSalon: (salon: Salon) => void;
  onUpdateServices: (vendorId: string, services: Service[]) => void;
}

// Modal Component
const Modal: React.FC<{onClose: () => void; children: React.ReactNode; title: string}> = ({ onClose, children, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

const VendorDashboard: React.FC<VendorDashboardProps> = ({ user, onLogout, bookings, withdrawals, onAddWithdrawal, salon, onUpdateSalon, onUpdateServices }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [error, setError] = useState('');
  
  // State for modals
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isManagingServices, setIsManagingServices] = useState(false);
  const [editingService, setEditingService] = useState<Service | null | 'new'>(null);

  // State for forms within modals
  const [salonName, setSalonName] = useState(salon.name);
  const [salonAddress, setSalonAddress] = useState(salon.address);
  const [serviceForm, setServiceForm] = useState({ id: '', name: '', price: 0, imageUrl: '' });


  useEffect(() => {
    setSalonName(salon.name);
    setSalonAddress(salon.address);
  }, [salon]);

  useEffect(() => {
    if (editingService && editingService !== 'new') {
        setServiceForm({ id: editingService.id, name: editingService.name, price: editingService.price, imageUrl: editingService.imageUrl });
    } else {
        setServiceForm({ id: '', name: '', price: 0, imageUrl: '' });
    }
  }, [editingService]);


  const vendorBookings = bookings.filter(b => b.vendorId === user.uid);
  const vendorWithdrawals = withdrawals.filter(w => w.vendorId === user.uid);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 500) {
      setError('Minimum withdrawal amount is 500৳.');
      return;
    }
    if (amount > user.balance) {
      setError('Insufficient balance.');
      return;
    }

    const fee = Math.floor(amount / 500) * 5;
    const newWithdrawal: Withdrawal = {
      withdrawId: `wd${Date.now()}`,
      vendorId: user.uid,
      amount: amount,
      fee: fee,
      status: WithdrawalStatus.PENDING,
      timestamp: Date.now(),
    };
    
    onAddWithdrawal(newWithdrawal);
    setWithdrawAmount('');
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSalon({ ...salon, name: salonName, address: salonAddress });
    setIsEditingProfile(false);
  };
  
  const handleServiceSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedServices: Service[];
    if (editingService === 'new') {
        const newService: Service = { ...serviceForm, id: `service${Date.now()}` };
        updatedServices = [...salon.services, newService];
    } else {
        updatedServices = salon.services.map(s => s.id === serviceForm.id ? serviceForm : s);
    }
    onUpdateServices(user.uid, updatedServices);
    setEditingService(null);
  }

  const handleServiceDelete = (serviceId: string) => {
    if(window.confirm('Are you sure you want to delete this service?')) {
        const updatedServices = salon.services.filter(s => s.id !== serviceId);
        onUpdateServices(user.uid, updatedServices);
    }
  }


  if (!user.approved) {
    return (
       <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={onLogout} />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Account Pending Approval</h2>
                <p className="mt-2">Your salon profile is under review by the administrator. You will be able to manage your salon and receive bookings once your account is approved.</p>
            </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {vendorBookings.length > 0 ? vendorBookings.map(booking => {
                    const customer = mockUsers.find(u => u.uid === booking.buyerId);
                    return (
                        <div key={booking.bookingId} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{booking.service}</p>
                                <p className="text-sm text-gray-500">By {customer?.name} on {new Date(booking.timestamp).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                               <p className="font-semibold text-lg">{booking.price}৳</p>
                               <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{booking.status}</span>
                            </div>
                        </div>
                    )
                }) : <p className="text-gray-500 text-center py-4">You have no recent bookings.</p>}
              </div>
            </div>

            {/* Withdrawal History */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>
                <div className="space-y-4">
                    {vendorWithdrawals.length > 0 ? vendorWithdrawals.map(w => (
                         <div key={w.withdrawId} className="p-4 border rounded-lg flex justify-between items-center">
                             <div>
                                <p className="font-bold text-lg">{w.amount}৳</p>
                                <p className="text-sm text-gray-500">Fee: {w.fee}৳ on {new Date(w.timestamp).toLocaleDateString()}</p>
                             </div>
                             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${w.status === WithdrawalStatus.APPROVED ? 'bg-green-100 text-green-800' : (w.status === WithdrawalStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')}`}>{w.status}</span>
                         </div>
                    )) : <p className="text-gray-500 text-center py-4">You have no withdrawal history.</p>}
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Balance & Withdraw */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Your Balance</h3>
              <p className="text-4xl font-extrabold text-indigo-600">{user.balance}৳</p>
              <form onSubmit={handleWithdrawRequest} className="mt-6">
                <label htmlFor="withdraw" className="font-semibold text-gray-700">Request Withdrawal</label>
                <input
                    id="withdraw"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min 500৳"
                    className="w-full mt-2 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                <button type="submit" className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-200">
                    Submit Request
                </button>
              </form>
            </div>

            {/* Manage Salon */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-xl font-bold mb-4">Manage Your Salon</h3>
                <button onClick={() => setIsEditingProfile(true)} className="w-full mb-3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition duration-200">
                    Edit Profile
                </button>
                 <button onClick={() => setIsManagingServices(true)} className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition duration-200">
                    Manage Services
                </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {isEditingProfile && (
        <Modal title="Edit Salon Profile" onClose={() => setIsEditingProfile(false)}>
            <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                    <label htmlFor="salonName" className="block text-gray-700 font-semibold mb-2">Salon Name</label>
                    <input id="salonName" type="text" value={salonName} onChange={e => setSalonName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="mb-6">
                    <label htmlFor="salonAddress" className="block text-gray-700 font-semibold mb-2">Salon Address</label>
                    <input id="salonAddress" type="text" value={salonAddress} onChange={e => setSalonAddress(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">Save Changes</button>
            </form>
        </Modal>
      )}

      {isManagingServices && !editingService && (
        <Modal title="Manage Services" onClose={() => setIsManagingServices(false)}>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {salon.services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-gray-600">{service.price}৳</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => setEditingService(service)} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded">Edit</button>
                            <button onClick={() => handleServiceDelete(service.id)} className="text-sm bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setEditingService('new')} className="w-full mt-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition">Add New Service</button>
        </Modal>
      )}

      {isManagingServices && editingService && (
         <Modal title={editingService === 'new' ? 'Add New Service' : 'Edit Service'} onClose={() => setEditingService(null)}>
            <form onSubmit={handleServiceSave} className="space-y-4">
                 <div>
                    <label htmlFor="serviceName" className="block text-gray-700 font-semibold mb-1">Service Name</label>
                    <input id="serviceName" type="text" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label htmlFor="servicePrice" className="block text-gray-700 font-semibold mb-1">Price (৳)</label>
                    <input id="servicePrice" type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: parseFloat(e.target.value)})} className="w-full px-4 py-2 border rounded-lg" required />
                </div>
                 <div>
                    <label htmlFor="serviceImage" className="block text-gray-700 font-semibold mb-1">Image URL</label>
                    <input id="serviceImage" type="text" value={serviceForm.imageUrl} onChange={e => setServiceForm({...serviceForm, imageUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="https://example.com/image.png" required />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Save Service</button>
                </div>
            </form>
         </Modal>
      )}

    </div>
  );
};

export default VendorDashboard;