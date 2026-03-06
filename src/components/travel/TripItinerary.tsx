import { useState, FormEvent } from "react";
import { ArrowLeft, Plus, Calendar, MapPin, Clock, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { motion } from "motion/react";

interface ItineraryItem {
  id: number;
  day: number;
  time: string;
  activity: string;
  location: string;
}

interface TripItineraryProps {
  items: ItineraryItem[];
  tripImage?: string;
  tripDestination?: string;
  onUpdate: (items: ItineraryItem[]) => void;
  onBack: () => void;
}

export function TripItinerary({ items, tripImage, tripDestination, onUpdate, onBack }: TripItineraryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({ day: 1, time: "", activity: "", location: "" });

  const deleteItem = (id: number) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.activity || !newItem.day) return;
    
    const item: ItineraryItem = {
      id: Date.now(),
      day: newItem.day || 1,
      time: newItem.time || "00:00",
      activity: newItem.activity,
      location: newItem.location || ""
    };

    // Sort by day then time
    const updatedItems = [...items, item].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.time.localeCompare(b.time);
    });

    onUpdate(updatedItems);
    setNewItem({ day: 1, time: "", activity: "", location: "" });
    setIsModalOpen(false);
  };

  // Group items by day
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 rounded-full transition-colors shadow-sm">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold font-serif text-gray-800 flex items-center gap-2">
          Lịch trình
        </h2>
      </div>

      {tripImage && (
        <div className="relative w-full h-40 rounded-3xl overflow-hidden shadow-md mb-6">
          <img src={tripImage} alt={tripDestination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm opacity-80 font-medium">Khám phá</p>
            <h3 className="text-xl font-bold font-serif leading-tight">{tripDestination}</h3>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white min-h-[50vh]">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-green-100 text-green-500 rounded-full hover:bg-green-200 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {Object.keys(groupedItems).length === 0 && (
            <div className="text-center text-gray-400 py-10 font-medium">
              Chưa có lịch trình nào. Lên kế hoạch ngay! 🗺️
            </div>
          )}
          
          {Object.entries(groupedItems).map(([day, dayItems]) => (
            <div key={day} className="relative pl-4 border-l-2 border-green-200 space-y-4">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-400 ring-4 ring-green-100" />
              <h3 className="font-bold text-lg text-gray-800 font-serif">Ngày {day}</h3>
              
              {dayItems.map((item) => (
                <motion.div 
                  layout
                  key={item.id}
                  className="bg-white/50 p-4 rounded-2xl border border-white/60 relative group shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-1">
                        <Clock size={14} />
                        {item.time}
                      </div>
                      <h4 className="font-bold text-gray-800">{item.activity}</h4>
                      {item.location && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <MapPin size={12} />
                          {item.location}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm hoạt động 🗺️"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thứ</label>
              <input
                type="number"
                min="1"
                value={newItem.day}
                onChange={(e) => setNewItem({ ...newItem, day: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
              <input
                type="time"
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt động</label>
            <input
              type="text"
              value={newItem.activity}
              onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="VD: Ăn sáng, Tham quan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm (Tùy chọn)</label>
            <input
              type="text"
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="VD: Phở Bát Đàn..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
          >
            Thêm vào lịch trình
          </button>
        </form>
      </Modal>
    </div>
  );
}
