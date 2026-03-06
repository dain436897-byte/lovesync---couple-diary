import { useState, FormEvent } from "react";
import { ArrowLeft, Plus, Book, Trash2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { motion } from "motion/react";

interface DiaryEntry {
  id: number;
  date: string;
  content: string;
  mood: string;
}

interface TripDiaryProps {
  items: DiaryEntry[];
  tripImage?: string;
  tripDestination?: string;
  onUpdate: (items: DiaryEntry[]) => void;
  onBack: () => void;
}

export function TripDiary({ items, tripImage, tripDestination, onUpdate, onBack }: TripDiaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({ date: new Date().toISOString().split('T')[0], content: "", mood: "😊" });

  const deleteItem = (id: number) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newEntry.content || !newEntry.date) return;
    
    const item: DiaryEntry = {
      id: Date.now(),
      date: newEntry.date || "",
      content: newEntry.content,
      mood: newEntry.mood || "😊"
    };

    onUpdate([item, ...items]);
    setNewEntry({ date: new Date().toISOString().split('T')[0], content: "", mood: "😊" });
    setIsModalOpen(false);
  };

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 rounded-full transition-colors shadow-sm">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold font-serif text-gray-800 flex items-center gap-2">
          Nhật ký
        </h2>
      </div>

      {tripImage && (
        <div className="relative w-full h-40 rounded-3xl overflow-hidden shadow-md mb-6">
          <img src={tripImage} alt={tripDestination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm opacity-80 font-medium">Kỷ niệm tại</p>
            <h3 className="text-xl font-bold font-serif leading-tight">{tripDestination}</h3>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white min-h-[50vh]">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-rose-100 text-rose-500 rounded-full hover:bg-rose-200 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {items.length === 0 && (
            <div className="text-center text-gray-400 py-10 font-medium">
              Chưa có nhật ký nào. Viết ngay nhé! ✍️
            </div>
          )}
          
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="relative p-6 bg-[#fff9c4] rounded-xl shadow-sm transform rotate-1 hover:rotate-0 transition-transform border border-yellow-200/50"
            >
              <div className="absolute top-0 left-0 w-full h-8 bg-black/5 rounded-t-xl" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-red-300/50 rotate-2" />
              
              <div className="flex justify-between items-start mt-2 mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.date}</span>
                <span className="text-xl">{item.mood}</span>
              </div>
              
              <p className="font-handwriting text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>

              <button 
                onClick={() => deleteItem(item.id)}
                className="absolute bottom-2 right-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Viết nhật ký ✍️"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cảm xúc</label>
            <select
              value={newEntry.mood}
              onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="😊">😊 Vui vẻ</option>
              <option value="😍">😍 Hạnh phúc</option>
              <option value="😎">😎 Chill</option>
              <option value="😴">😴 Mệt mỏi</option>
              <option value="😋">😋 Ăn ngon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 min-h-[150px] font-handwriting text-lg"
              placeholder="Hôm nay thế nào..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
          >
            Lưu nhật ký
          </button>
        </form>
      </Modal>
    </div>
  );
}
