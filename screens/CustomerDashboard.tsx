import React, { useState } from 'react';
import { User, Salon, Service, Booking, BookingStatus, WalletType } from '../types';
import Header from '../components/Header';

interface CustomerDashboardProps {
  user: User;
  onLogout: () => void;
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
  salons: Salon[];
  users: User[];
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const SalonCard: React.FC<{ salon: Salon; onSelect: (salon: Salon) => void }> = ({ salon, onSelect }) => (
    <div onClick={() => onSelect(salon)} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300">
        <img src={salon.bannerUrl} alt={salon.name} className="w-full h-40 object-cover" />
        <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{salon.name}</h3>
              {salon.rating && (
                <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full">
                    <StarIcon className="h-4 w-4" />
                    <span className="font-bold text-sm">{salon.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">{salon.address}</p>
        </div>
    </div>
);


const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout, bookings, onAddBooking, salons, users }) => {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const myBookings = bookings.filter(b => b.buyerId === user.uid);
  
  const handleBooking = (service: Service) => {
    const newBooking = {
      bookingId: `booking${Date.now()}`,
      buyerId: user.uid,
      vendorId: selectedSalon!.vendorId,
      service: service.name,
      price: service.price,
      status: BookingStatus.PENDING,
      paymentMethod: WalletType.BKASH, // Mocked
      transactionId: `TX${Date.now()}`,
      timestamp: Date.now(),
    };
    onAddBooking(newBooking);
    setSelectedSalon(null);
  }
  
  const approvedSalons = salons.filter(s => users.find(u => u.uid === s.vendorId && u.approved));
  const filteredSalons = approvedSalons.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (selectedSalon) {
    return (
       <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={onLogout} />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={() => setSelectedSalon(null)} className="mb-6 bg-indigo-100 text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition duration-150">
                &larr; Back to Salons
            </button>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={selectedSalon.bannerUrl} alt={selectedSalon.name} className="w-full h-64 object-cover"/>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{selectedSalon.name}</h2>
                            <p className="text-lg text-gray-600 mt-1">{selectedSalon.address}</p>
                        </div>
                         {selectedSalon.rating && (
                            <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-100 px-3 py-2 rounded-full">
                                <StarIcon />
                                <span className="font-bold text-lg">{selectedSalon.rating.toFixed(1)}</span>
                            </div>
                         )}
                    </div>
                    <h3 className="text-2xl font-semibold mt-8 mb-4">Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedSalon.services.map(service => (
                            <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                                <img src={service.imageUrl} alt={service.name} className="w-full h-32 object-cover rounded-md mb-4"/>
                                <h4 className="text-lg font-semibold">{service.name}</h4>
                                <p className="text-indigo-600 font-bold text-xl my-2">{service.price}৳</p>
                                <button onClick={() => handleBooking(service)} className="w-full mt-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Browse Salons</h2>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a salon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSalons.map(salon => (
            <SalonCard key={salon.vendorId} salon={salon} onSelect={setSelectedSalon} />
          ))}
        </div>
         <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">My Bookings</h2>
         <div className="bg-white rounded-xl shadow-lg p-6">
           <div className="space-y-4">
            {myBookings.length > 0 ? myBookings.map(booking => {
              const salon = salons.find(s => s.vendorId === booking.vendorId);
              return (
              <div key={booking.bookingId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div>
                  <p className="font-bold text-lg">{booking.service} at {salon?.name}</p>
                  <p className="text-sm text-gray-500">{new Date(booking.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-right flex-grow">
                      <p className="font-semibold text-lg">{booking.price}৳</p>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{booking.status}</span>
                    </div>
                    {booking.status === BookingStatus.COMPLETED && (
                        <button onClick={() => alert('Rating feature coming soon!')} className="px-3 py-2 bg-gray-200 text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-300 transition duration-200">
                           Rate
                        </button>
                    )}
                </div>
              </div>
            )}) : <p>You have no bookings yet.</p>}
           </div>
         </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;