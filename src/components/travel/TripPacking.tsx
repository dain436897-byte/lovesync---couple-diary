import { useState, FormEvent } from "react";
import { ArrowLeft, Plus, CheckSquare, Square, Trash2, Briefcase, Shirt, Smartphone, Camera, Utensils, Stethoscope, Map, Sun, Edit2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { motion } from "motion/react";

interface PackingItem {
  id: number;
  text: string;
  checked: boolean;
  color?: string;
  icon?: string;
}

const ICONS = [
  { id: 'briefcase', icon: Briefcase },
  { id: 'shirt', icon: Shirt },
  { id: 'smartphone', icon: Smartphone },
  { id: 'camera', icon: Camera },
  { id: 'utensils', icon: Utensils },
  { id: 'stethoscope', icon: Stethoscope },
  { id: 'map', icon: Map },
  { id: 'sun', icon: Sun },
];

const COLORS = [
  { id: 'orange', bg: 'bg-orange-100', text: 'text-orange-500', border: 'border-orange-200' },
  { id: 'blue', bg: 'bg-blue-100', text: 'text-blue-500', border: 'border-blue-200' },
  { id: 'green', bg: 'bg-green-100', text: 'text-green-500', border: 'border-green-200' },
  { id: 'purple', bg: 'bg-purple-100', text: 'text-purple-500', border: 'border-purple-200' },
  { id: 'pink', bg: 'bg-pink-100', text: 'text-pink-500', border: 'border-pink-200' },
  { id: 'red', bg: 'bg-red-100', text: 'text-red-500', border: 'border-red-200' },
];

interface TripPackingProps {
  items: PackingItem[];
  tripImage?: string;
  tripDestination?: string;
  onUpdate: (items: PackingItem[]) => void;
  onBack: () => void;
}

const QUICK_ITEMS = [
  { text: "Sạc dự phòng", icon: "smartphone", color: "blue" },
  { text: "Kem chống nắng", icon: "sun", color: "orange" },
  { text: "Bàn chải", icon: "utensils", color: "green" },
  { text: "Máy ảnh", icon: "camera", color: "purple" },
];

export function TripPacking({ items, tripImage, tripDestination, onUpdate, onBack }: TripPackingProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null);
  const [newItem, setNewItem] = useState("");
  const [selectedIcon, setSelectedIcon] = useState('briefcase');
  const [selectedColor, setSelectedColor] = useState('orange');

  const toggleItem = (id: number) => {
    onUpdate(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: number) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItem("");
    setSelectedIcon('briefcase');
    setSelectedColor('orange');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PackingItem) => {
    setEditingItem(item);
    setNewItem(item.text);
    setSelectedIcon(item.icon || 'briefcase');
    setSelectedColor(item.color || 'orange');
    setIsModalOpen(true);
  };

  const handleQuickAdd = (item: typeof QUICK_ITEMS[0]) => {
    onUpdate([...items, {
      id: Date.now(),
      text: item.text,
      checked: false,
      icon: item.icon,
      color: item.color
    }]);
    setIsModalOpen(false);
  };

  const handleSaveItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItem) return;

    if (editingItem) {
      onUpdate(items.map(item =>
        item.id === editingItem.id
          ? { ...item, text: newItem, icon: selectedIcon, color: selectedColor }
          : item
      ));
    } else {
      onUpdate([...items, {
        id: Date.now(),
        text: newItem,
        checked: false,
        icon: selectedIcon,
        color: selectedColor
      }]);
    }

    setNewItem("");
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getIconComponent = (iconId?: string) => {
    const found = ICONS.find(i => i.id === iconId);
    const IconComp = found ? found.icon : Briefcase;
    return <IconComp size={18} />;
  };

  const getColorClasses = (colorId?: string) => {
    return COLORS.find(c => c.id === colorId) || COLORS[0];
  };

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 rounded-full transition-colors shadow-sm">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold font-serif text-gray-800 flex items-center gap-2">
          Hành lý
        </h2>
      </div>

      {tripImage && (
        <div className="relative w-full h-40 rounded-3xl overflow-hidden shadow-md mb-6">
          <img src={tripImage} alt={tripDestination} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm opacity-80 font-medium">Chuẩn bị cho</p>
            <h3 className="text-xl font-bold font-serif leading-tight">{tripDestination}</h3>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white min-h-[50vh]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 font-bold">
            Đã chuẩn bị: {items.filter(i => i.checked).length}/{items.length}
          </span>
          <button
            onClick={openAddModal}
            className="p-2 bg-orange-100 text-orange-500 rounded-full hover:bg-orange-200 transition-colors shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {items.length === 0 && (
            <div className="text-center text-gray-400 py-10 font-medium">
              Chưa có món đồ nào. Thêm ngay nhé! 🎒
            </div>
          )}
          {items.map((item) => {
            const colorClasses = getColorClasses(item.color);
            return (
              <motion.div
                layout
                key={item.id}
                className={`flex items-center gap-3 group p-3 bg-white/50 rounded-xl border border-white/60 hover:bg-white/80 transition-all ${item.checked ? 'opacity-60' : ''}`}
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} border shadow-sm transition-transform active:scale-90`}
                >
                  {getIconComponent(item.icon)}
                </div>
                <span
                  onClick={() => toggleItem(item.id)}
                  className={`text-sm font-semibold flex-1 cursor-pointer ${item.checked ? 'text-gray-400 line-through decoration-2 decoration-gray-300' : 'text-gray-700'}`}
                >
                  {item.text}
                </span>

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div
                  onClick={() => toggleItem(item.id)}
                  className={`transition-colors cursor-pointer ${item.checked ? 'text-green-500' : 'text-gray-300 group-hover:text-orange-300'}`}
                >
                  {item.checked ? <CheckSquare size={22} /> : <Square size={22} />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Chỉnh sửa món đồ ✏️" : "Thêm đồ cần mang 🎒"}
      >
        <div className="space-y-6">
          {!editingItem && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Thêm nhanh</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAdd(item)}
                    className="px-3 py-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-500 rounded-xl text-xs font-bold text-gray-500 border border-gray-100 transition-all flex items-center gap-2"
                  >
                    {getIconComponent(item.icon)}
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSaveItem} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tên món đồ</label>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-gray-50/50"
                placeholder="VD: Sạc điện thoại, Kem chống nắng..."
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Chọn Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {ICONS.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-3 rounded-xl flex items-center justify-center border-2 transition-all ${selectedIcon === item.id
                          ? 'border-orange-500 bg-orange-50 text-orange-500'
                          : 'border-gray-50 bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                      <IconComp size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Chọn Màu sắc</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.id
                        ? 'border-gray-800 scale-110'
                        : 'border-transparent'
                      } ${color.bg}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
            >
              {editingItem ? "Cập nhật" : "Thêm vào danh sách"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
