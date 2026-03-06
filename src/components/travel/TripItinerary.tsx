import React, { useState, FormEvent, useRef } from "react";
import { ArrowLeft, Plus, MapPin, Clock, Trash2, Edit2, ChevronDown, ChevronUp, Check, DollarSign, Camera, Image as ImageIcon, Plane, Coffee, Utensils, Bed, Car, Train, Map, ShoppingBag, Music } from "lucide-react";
import { Modal } from "../ui/Modal";
import { motion, AnimatePresence } from "motion/react";
import { compressImage } from "../../lib/imageUtils";

export interface ItineraryItem {
  id: number;
  day: number;
  time: string;
  activity: string;
  location: string;
  done?: boolean;
  cost?: number;
  costNote?: string;
  photo?: string;
}

interface TripItineraryProps {
  items: ItineraryItem[];
  tripImage?: string;
  tripDestination?: string;
  onUpdate: (items: ItineraryItem[]) => void;
  onBack: () => void;
}

const emptyItem = (): Partial<ItineraryItem> => ({ day: 1, time: "", activity: "", location: "", cost: undefined, costNote: "", photo: "" });

export function TripItinerary({ items, tripImage, tripDestination, onUpdate, onBack }: TripItineraryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [formData, setFormData] = useState<Partial<ItineraryItem>>(emptyItem());
  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(new Set());
  const photoInputRef = useRef<HTMLInputElement>(null);

  const toggleDay = (day: number) => {
    setCollapsedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const toggleDone = (id: number) => {
    onUpdate(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteItem = (id: number) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const openEdit = (item: ItineraryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData(emptyItem());
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressedBase64 = await compressImage(e.target.files[0], 200, 800);
        setFormData(p => ({ ...p, photo: compressedBase64 }));
      } catch (error) {
        console.error("Error compressing image:", error);
        // Fallback to original if compression fails
        const reader = new FileReader();
        reader.onload = () => setFormData(prev => ({ ...prev, photo: reader.result as string }));
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const getActivityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('bay') || lower.includes('sân bay')) return Plane;
    if (lower.includes('khách sạn') || lower.includes('resort') || lower.includes('ngủ') || lower.includes('nhận phòng')) return Bed;
    if (lower.includes('ăn') || lower.includes('nhà hàng') || lower.includes('bữa')) return Utensils;
    if (lower.includes('cafe') || lower.includes('trà') || lower.includes('coffee')) return Coffee;
    if (lower.includes('xe') || lower.includes('taxi') || lower.includes('bus')) return Car;
    if (lower.includes('tàu')) return Train;
    if (lower.includes('mua sắm') || lower.includes('chợ')) return ShoppingBag;
    if (lower.includes('chơi') || lower.includes('công viên') || lower.includes('nhạc') || lower.includes('bar')) return Music;
    return Map;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.activity || !formData.day) return;

    if (editingItem) {
      onUpdate(
        items.map(i => i.id === editingItem.id ? { ...editingItem, ...formData } as ItineraryItem : i)
          .sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time))
      );
    } else {
      const item: ItineraryItem = {
        id: Date.now(),
        day: formData.day || 1,
        time: formData.time || "00:00",
        activity: formData.activity,
        location: formData.location || "",
        done: false,
        cost: formData.cost,
        costNote: formData.costNote || "",
        photo: formData.photo || "",
      };
      onUpdate([...items, item].sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time)));
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(emptyItem());
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const dayTotal = (dayItems: ItineraryItem[]) =>
    dayItems.reduce((sum, i) => sum + (i.cost || 0), 0);

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 rounded-full transition-colors shadow-sm">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold font-serif text-gray-800">Lịch trình</h2>
      </div>

      {tripImage && (
        <div className="relative w-full h-40 rounded-3xl overflow-hidden shadow-md">
          <img src={tripImage} alt={tripDestination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm opacity-80 font-medium">Khám phá</p>
            <h3 className="text-xl font-bold font-serif leading-tight">{tripDestination}</h3>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-5 shadow-sm border-2 border-white min-h-[50vh]">
        <div className="flex justify-end mb-4">
          <button onClick={openAdd} className="p-2 bg-green-100 text-green-500 rounded-full hover:bg-green-200 transition-colors shadow-sm">
            <Plus size={20} />
          </button>
        </div>

        {Object.keys(groupedItems).length === 0 && (
          <div className="text-center text-gray-400 py-10 font-medium">Chưa có lịch trình nào. Lên kế hoạch ngay! 🗺️</div>
        )}

        <div className="space-y-3">
          {Object.entries(groupedItems).map(([day, dayItems]) => {
            const dayNum = parseInt(day);
            const isCollapsed = collapsedDays.has(dayNum);
            const doneCount = dayItems.filter(i => i.done).length;
            const total = dayTotal(dayItems);

            return (
              <div key={day} className="rounded-2xl overflow-hidden border border-green-100 shadow-sm">
                <button
                  onClick={() => toggleDay(dayNum)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">{day}</div>
                    <span className="font-bold text-gray-800 font-serif">Ngày {day}</span>
                    <span className="text-xs text-gray-400">({doneCount}/{dayItems.length} xong)</span>
                    {total > 0 && <span className="text-xs text-emerald-600 font-semibold">· {total.toLocaleString('vi-VN')}đ</span>}
                  </div>
                  {isCollapsed ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-gray-50">
                        {dayItems.map((item) => (
                          <div key={item.id} className={`px-4 py-3 bg-white group transition-colors ${item.done ? 'opacity-60' : ''}`}>
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleDone(item.id)}
                                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.done ? 'bg-green-400 border-green-400' : 'border-gray-300 hover:border-green-400'}`}
                              >
                                {item.done && <Check size={12} className="text-white" />}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-green-600 font-semibold text-xs mb-1">
                                  <Clock size={11} />{item.time}
                                </div>
                                <div className="flex items-center gap-2">
                                  {React.createElement(getActivityIcon(item.activity), { size: 14, className: "text-gray-400 flex-shrink-0" })}
                                  <p className={`font-semibold text-gray-800 text-sm leading-tight ${item.done ? 'line-through text-gray-400' : ''}`}>{item.activity}</p>
                                </div>
                                {item.location && (
                                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                                    <MapPin size={10} />{item.location}
                                  </div>
                                )}
                                {/* Cost + costNote */}
                                {(item.cost || item.costNote) && (
                                  <div className="flex items-center gap-1 text-emerald-600 text-xs mt-1">
                                    <DollarSign size={10} />
                                    {item.cost ? `${item.cost.toLocaleString('vi-VN')}đ` : ''}
                                    {item.costNote && <span className="text-gray-400 ml-1">{item.costNote}</span>}
                                  </div>
                                )}
                                {/* Memory photo thumbnail */}
                                {item.photo && (
                                  <img src={item.photo} alt="memory" className="mt-2 h-16 w-24 object-cover rounded-lg border border-gray-100 shadow-sm" />
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button onClick={() => openEdit(item)} className="p-1.5 text-gray-300 hover:text-blue-400 transition-colors">
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => deleteItem(item.id)} className="p-1.5 text-gray-300 hover:text-red-400 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        title={editingItem ? "Sửa hoạt động ✏️" : "Thêm hoạt động 🗺️"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thứ</label>
              <input type="number" min="1" value={formData.day ?? 1}
                onChange={e => setFormData(p => ({ ...p, day: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
              <input type="time" value={formData.time ?? ""}
                onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoạt động</label>
            <input type="text" value={formData.activity ?? ""}
              onChange={e => setFormData(p => ({ ...p, activity: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="VD: Ăn sáng, Tham quan..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm (Tùy chọn)</label>
            <input type="text" value={formData.location ?? ""}
              onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="VD: Phở Bát Đàn..." />
          </div>

          {/* Cost section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí (đ)</label>
              <input type="number" min="0" value={formData.cost ?? ""}
                onChange={e => setFormData(p => ({ ...p, cost: e.target.value ? parseInt(e.target.value) : undefined }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="VD: 50000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú chi phí</label>
              <input type="text" value={formData.costNote ?? ""}
                onChange={e => setFormData(p => ({ ...p, costNote: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                placeholder="VD: Vé tàu, Xe ôm..." />
            </div>
          </div>

          {/* Memory photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh kỷ niệm (Tùy chọn)</label>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            {formData.photo ? (
              <div className="relative">
                <img src={formData.photo} alt="preview" className="h-24 w-full object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => setFormData(p => ({ ...p, photo: "" }))}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => photoInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-green-300 hover:text-green-500 transition-colors flex items-center justify-center gap-2">
                <Camera size={18} /> Chọn ảnh kỷ niệm
              </button>
            )}
          </div>

          <button type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">
            {editingItem ? "Lưu thay đổi" : "Thêm vào lịch trình"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
