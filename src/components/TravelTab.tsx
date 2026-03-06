import { motion } from "motion/react";
import { Plane, Edit2, Book, History, MapPin, Calendar, Clock, Image as ImageIcon, Trash2, Wallet } from "lucide-react";
import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { useFirebaseSync } from "../hooks/useFirebaseSync";
import { TripPacking } from "./travel/TripPacking";
import { TripItinerary } from "./travel/TripItinerary";
import { TripDiary } from "./travel/TripDiary";
import { TripSummary } from "./travel/TripSummary";

const initialTrip = {
  destination: "Đà Lạt Mộng Mơ 🌸",
  startDate: "2024-12-25",
  endDate: "2024-12-30",
  time: "08:00",
  budget: 5000000,
  image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
  packingList: [
    { id: 1, text: "Áo khoác ấm", checked: false },
    { id: 2, text: "Máy ảnh", checked: true },
  ],
  itinerary: [
    { id: 1, day: 1, time: "08:00", activity: "Ăn sáng bánh mì xíu mại", location: "Hoàng Diệu" },
    { id: 2, day: 1, time: "14:00", activity: "Check-in Quảng trường", location: "Lâm Viên" },
  ],
  diary: [
    { id: 1, date: "2024-12-25", content: "Ngày đầu tiên ở Đà Lạt thật tuyệt! Không khí se lạnh thích ghê.", mood: "😍" }
  ]
};

const initialPastTrips = [
  {
    id: 1,
    destination: "Nha Trang Biển Gọi 🌊",
    date: "2023-06-15",
    diary: [
      { id: 1, date: "2023-06-15", content: "Biển xanh cát trắng nắng vàng, hải sản ngon tuyệt vời!", mood: "🥰" },
      { id: 2, date: "2023-06-16", content: "Đi lặn san hô mệt nhưng vui, thấy được cá Nemo luôn.", mood: "🐠" }
    ]
  },
  {
    id: 2,
    destination: "Sapa Mù Sương ☁️",
    date: "2022-11-10",
    diary: [
      { id: 1, date: "2022-11-10", content: "Lạnh buốt nhưng cảnh đẹp như tranh vẽ.", mood: "🥶" }
    ]
  }
];

export function TravelTab() {
  const [view, setView] = useState<'overview' | 'packing' | 'itinerary' | 'diary' | 'summary'>('overview');
  const [trip, setTrip] = useFirebaseSync('couple_trip', initialTrip);
  const [pastTrips, setPastTrips] = useFirebaseSync('couple_past_trips', initialPastTrips);
  const [selectedPastTrip, setSelectedPastTrip] = useState<any>(null);

  // Modals state
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [isPastTripModalOpen, setIsPastTripModalOpen] = useState(false);

  // Form state
  const [editTripData, setEditTripData] = useState({ destination: "", startDate: "", endDate: "", time: "", image: "", budget: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      // Combine date and time to parse safely across browsers
      const tripDateStr = `${trip.startDate}T${trip.time || '00:00'}:00`;
      const tripDate = new Date(tripDateStr).getTime();
      const distance = tripDate - now;

      if (isNaN(distance) || distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown({ days, hours, minutes });
    };

    calculateCountdown(); // Run immediately
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [trip.startDate, trip.time]);

  // Trip Edit Handler
  const handleEditTrip = (e: FormEvent) => {
    e.preventDefault();
    if (!editTripData.destination || !editTripData.startDate) return;
    setTrip(prev => ({
      ...prev,
      destination: editTripData.destination,
      startDate: editTripData.startDate,
      endDate: editTripData.endDate,
      time: editTripData.time,
      image: editTripData.image,
      budget: Number(editTripData.budget) || 0
    }));
    setIsEditTripModalOpen(false);
  };

  const openEditTripModal = () => {
    setEditTripData({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      time: trip.time,
      image: trip.image,
      budget: trip.budget?.toString() || ""
    });
    setIsEditTripModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { compressImage } = await import('../lib/imageUtils');
        const compressed = await compressImage(file, 200, 800);
        setEditTripData(prev => ({ ...prev, image: compressed }));
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => setEditTripData(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
      }
    }
  };

  const openPastTrip = (trip: any) => {
    setSelectedPastTrip(trip);
    setIsPastTripModalOpen(true);
  };

  const deletePastTrip = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPastTrips(prev => prev.filter(t => t.id !== id));
  };

  // Sub-view rendering
  if (view === 'packing') {
    return (
      <TripPacking
        items={trip.packingList}
        tripImage={trip.image}
        tripDestination={trip.destination}
        onUpdate={(items) => setTrip(prev => ({ ...prev, packingList: items }))}
        onBack={() => setView('overview')}
      />
    );
  }

  if (view === 'itinerary') {
    return (
      <TripItinerary
        items={trip.itinerary}
        tripImage={trip.image}
        tripDestination={trip.destination}
        onUpdate={(items) => setTrip(prev => ({ ...prev, itinerary: items }))}
        onBack={() => setView('overview')}
      />
    );
  }

  if (view === 'diary') {
    return (
      <TripDiary
        items={trip.diary}
        tripImage={trip.image}
        tripDestination={trip.destination}
        onUpdate={(items) => setTrip(prev => ({ ...prev, diary: items }))}
        onBack={() => setView('overview')}
      />
    );
  }

  if (view === 'summary') {
    return (
      <TripSummary
        trip={trip}
        onBack={() => setView('overview')}
      />
    );
  }

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      {/* Next Trip Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden shadow-lg group min-h-[340px] flex flex-col justify-end"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800"}
            alt={trip.destination}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>

        {/* Top bar */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full">
            <Plane size={12} className="text-pink-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-100">Chuyến đi sắp tới</span>
          </div>
          <button
            onClick={openEditTripModal}
            className="p-1.5 bg-black/25 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
          >
            <Edit2 size={14} />
          </button>
        </div>

        {/* Bottom content - compact */}
        <div className="relative z-10 px-4 pb-4 pt-2 text-white">
          <h2 className="text-3xl font-bold font-serif leading-tight text-white drop-shadow-md mb-1">{trip.destination}</h2>

          {/* Date / time / budget - single compact line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-gray-200 mb-2.5 opacity-90">
            <div className="flex items-center gap-1"><Calendar size={10} /><span>{trip.startDate}{trip.endDate ? ` - ${trip.endDate}` : ''}</span></div>
            <span>•</span>
            <div className="flex items-center gap-1"><Clock size={10} /><span>{trip.time}</span></div>
            {trip.budget > 0 && (<><span>•</span><div className="flex items-center gap-1 text-emerald-300"><Wallet size={10} /><span>{trip.budget.toLocaleString('vi-VN')} đ</span></div></>)}
          </div>

          {/* Compact inline countdown */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-white drop-shadow-md">{countdown.days}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-80 mt-1 font-semibold text-pink-100">Ngày</span>
            </div>
            <span className="text-white/50 text-xl font-light -mt-4">:</span>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-white drop-shadow-md">{countdown.hours}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-80 mt-1 font-semibold text-pink-100">Giờ</span>
            </div>
            <span className="text-white/50 text-xl font-light -mt-4">:</span>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold text-white drop-shadow-md">{countdown.minutes}</span>
              </div>
              <span className="text-[9px] uppercase tracking-wider opacity-80 mt-1 font-semibold text-pink-100">Phút</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Planning Tools - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('packing')}
          className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center gap-2 text-center"
        >
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🎒</div>
          <span className="font-bold text-gray-700 text-sm">Hành lý</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('itinerary')}
          className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center gap-2 text-center"
        >
          <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🗺️</div>
          <span className="font-bold text-gray-700 text-sm">Lịch trình</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('diary')}
          className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center gap-2 text-center"
        >
          <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center shadow-sm">
            <Book size={22} />
          </div>
          <span className="font-bold text-gray-700 text-sm">Nhật ký</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('summary')}
          className="bg-white/70 backdrop-blur-md p-5 rounded-[2rem] border-2 border-white shadow-sm flex flex-col items-center gap-2 text-center"
        >
          <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-sm">📊</div>
          <span className="font-bold text-gray-700 text-sm">Tổng kết</span>
        </motion.button>
      </div>

      {/* Past Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-100 text-amber-500 rounded-2xl shadow-sm">
            <History size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-xl text-gray-800 font-handwriting">Kỷ niệm đã qua</h3>
        </div>

        <div className="space-y-4">
          {pastTrips.length === 0 && (
            <div className="text-center text-gray-400 py-4 text-sm font-medium">
              Chưa có chuyến đi nào được lưu lại.
            </div>
          )}
          {pastTrips.map((pastTrip) => (
            <div
              key={pastTrip.id}
              onClick={() => openPastTrip(pastTrip)}
              className="bg-white/50 p-4 rounded-2xl border border-white/60 cursor-pointer hover:bg-white/80 transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={16} className="text-amber-500" />
                  {pastTrip.destination}
                </h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar size={12} />
                  {pastTrip.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Book size={16} />
                </div>
                <button
                  onClick={(e) => deletePastTrip(e, pastTrip.id)}
                  className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modals */}
      <Modal
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        title="Chỉnh sửa chuyến đi ✈️"
      >
        <form onSubmit={handleEditTrip} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh mục tiêu</label>
            <div
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {editTripData.image ? (
                <img src={editTripData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">Chọn ảnh nền</span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến</label>
            <input
              type="text"
              value={editTripData.destination}
              onChange={(e) => setEditTripData({ ...editTripData, destination: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="VD: Đà Lạt..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đi</label>
              <input
                type="date"
                value={editTripData.startDate}
                onChange={(e) => setEditTripData({ ...editTripData, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày về</label>
              <input
                type="date"
                value={editTripData.endDate}
                onChange={(e) => setEditTripData({ ...editTripData, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ khởi hành</label>
              <input
                type="time"
                value={editTripData.time}
                onChange={(e) => setEditTripData({ ...editTripData, time: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách (VNĐ)</label>
              <input
                type="number"
                value={editTripData.budget}
                onChange={(e) => setEditTripData({ ...editTripData, budget: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="VD: 5000000"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            Cập nhật chuyến đi
          </button>
        </form>
      </Modal>

      {/* Past Trip Diary Modal */}
      <Modal
        isOpen={isPastTripModalOpen}
        onClose={() => setIsPastTripModalOpen(false)}
        title={selectedPastTrip?.destination || "Nhật ký"}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {selectedPastTrip?.diary.map((entry: any) => (
            <div key={entry.id} className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 relative">
              <div className="absolute -top-3 -right-3 text-3xl rotate-12 drop-shadow-sm">
                {entry.mood}
              </div>
              <div className="text-xs text-amber-500 font-bold mb-2 uppercase tracking-wider">
                {entry.date}
              </div>
              <p className="text-gray-700 leading-relaxed font-handwriting text-lg">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div >
  );
}
