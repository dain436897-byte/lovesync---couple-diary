import { motion } from "motion/react";
import { Heart, Camera, Calendar, Star, Plus, Upload, Download, Trash2, Edit2, Gift, Music, Coffee, Plane } from "lucide-react";
import { Header } from "./Header";
import React, { useState, FormEvent, useRef, useEffect, ChangeEvent } from "react";
import { Modal } from "./ui/Modal";
import { CoupleProfile } from "../types";
import { ImageCropper } from "./ui/ImageCropper";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { useFirebaseSync } from "../hooks/useFirebaseSync";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Camera,
  Calendar,
  Star,
  Gift,
  Music,
  Coffee,
  Plane
};

const colors = [
  "bg-rose-100 text-rose-500",
  "bg-pink-100 text-pink-500",
  "bg-red-100 text-red-500",
  "bg-yellow-100 text-yellow-500",
  "bg-blue-100 text-blue-500",
  "bg-emerald-100 text-emerald-500",
  "bg-purple-100 text-purple-500",
  "bg-orange-100 text-orange-500"
];

interface Milestone {
  id: number;
  date: string;
  title: string;
  iconName: string;
  color: string;
}

const initialMilestones: Milestone[] = [
  { id: 1, date: "11/11/2021", title: "Ngày đầu gặp gỡ", iconName: "Star", color: "bg-yellow-100 text-yellow-500" },
  { id: 2, date: "23/11/2021", title: "Chính thức yêu nhau", iconName: "Heart", color: "bg-red-100 text-red-500" },
  { id: 3, date: "14/02/2022", title: "Valentine đầu tiên", iconName: "Heart", color: "bg-pink-100 text-pink-500" },
  { id: 4, date: "20/05/2022", title: "Chuyến đi xa đầu tiên", iconName: "Camera", color: "bg-blue-100 text-blue-500" },
];

const initialPhotos = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop",
];

interface MemoriesTabProps {
  profile: CoupleProfile;
  onOpenSettings: () => void;
}

export function MemoriesTab({ profile, onOpenSettings }: MemoriesTabProps) {
  const [milestones, setMilestones] = useFirebaseSync<Milestone[]>('couple_milestones', initialMilestones);
  const [photos, setPhotos] = useFirebaseSync<string[]>('couple_photos', initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    id: 0,
    date: new Date().toISOString().split('T')[0],
    title: "",
    iconName: "Heart",
    color: "bg-rose-100 text-rose-500"
  });
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(null);

  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('auto');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumRef = useRef<HTMLDivElement>(null);

  // LocalStorage generic useEffects removed in favor of useFirebaseSync

  const handleAddMilestone = (e: FormEvent) => {
    e.preventDefault();
    if (!newMilestone.date || !newMilestone.title) return;

    const [year, month, day] = newMilestone.date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    if (editingMilestoneId) {
      setMilestones(prev => prev.map(m =>
        m.id === editingMilestoneId
          ? { ...m, date: formattedDate, title: newMilestone.title, iconName: newMilestone.iconName, color: newMilestone.color }
          : m
      ));
    } else {
      setMilestones(prev => [
        ...prev,
        {
          id: Date.now(),
          date: formattedDate,
          title: newMilestone.title,
          iconName: newMilestone.iconName,
          color: newMilestone.color
        }
      ]);
    }

    setNewMilestone({ id: 0, date: new Date().toISOString().split('T')[0], title: "", iconName: "Heart", color: "bg-rose-100 text-rose-500" });
    setEditingMilestoneId(null);
    setIsModalOpen(false);
  };

  const openEditMilestone = (milestone: Milestone) => {
    const [day, month, year] = milestone.date.split('/');
    setNewMilestone({
      id: milestone.id,
      date: `${year}-${month}-${day}`,
      title: milestone.title,
      iconName: milestone.iconName || "Heart",
      color: milestone.color || "bg-rose-100 text-rose-500"
    });
    setEditingMilestoneId(milestone.id);
    setIsModalOpen(true);
  };

  const deleteMilestone = (id: number) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const deletePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPendingPhotos: string[] = [];
      let loadedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          newPendingPhotos.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setPendingPhotos(newPendingPhotos);
            setCurrentCropIndex(0);
            setIsCropping(true);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    setIsCropping(false);
    setIsUploading(true);

    try {
      // Bypassing Firebase Storage due to billing limitations.
      // Saving directly as base64 string to Firestore via the sync hook.
      setPhotos(prev => [croppedImage, ...prev]);
    } catch (e) {
      console.error("Lỗi khi tải ảnh:", e);
    }

    setIsUploading(false);

    if (currentCropIndex < pendingPhotos.length - 1) {
      setCurrentCropIndex(prev => prev + 1);
      setTimeout(() => setIsCropping(true), 200);
    } else {
      setPendingPhotos([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setPendingPhotos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportAlbumToPDF = async () => {
    if (!albumRef.current) return;
    try {
      const imgData = await htmlToImage.toJpeg(albumRef.current, { quality: 1.0, pixelRatio: 2 });

      let pdf;
      if (exportFormat === 'auto') {
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => { img.onload = resolve; });

        pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, img.width, img.height);
      } else {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: exportFormat
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;

        let finalWidth = pdfWidth;
        let finalHeight = pdfWidth / imgRatio;

        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * imgRatio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      }

      pdf.save(`Album_Ky_Niem_${exportFormat}.pdf`);
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div className="pb-24 space-y-6">
      <Header profile={profile} onOpenSettings={onOpenSettings} />

      <div className="px-4 space-y-6 max-w-md mx-auto">
        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
                <Calendar size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl text-gray-800 font-handwriting">Cột mốc tình yêu</h3>
            </div>
            <button
              onClick={() => {
                setNewMilestone({ id: 0, date: new Date().toISOString().split('T')[0], title: "", iconName: "Heart", color: "bg-rose-100 text-rose-500" });
                setEditingMilestoneId(null);
                setIsModalOpen(true);
              }}
              className="p-2 bg-rose-100 text-rose-500 rounded-full hover:bg-rose-200 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="relative pl-4 border-l-2 border-pink-200 space-y-6">
            {milestones.length === 0 && (
              <div className="text-center text-gray-400 py-4 text-sm font-medium">
                Chưa có cột mốc nào. Thêm ngay nhé! ❤️
              </div>
            )}
            {milestones.map((milestone) => {
              const IconComponent = iconMap[milestone.iconName] || Heart;
              return (
                <div key={milestone.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100 group-hover:scale-125 transition-transform" />
                  <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-white/60 hover:bg-white/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${milestone.color}`}>
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{milestone.title}</h4>
                        <span className="text-xs text-gray-500 font-medium">{milestone.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditMilestone(milestone)} className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteMilestone(milestone.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Photo Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
                <Camera size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-xl text-gray-800 font-handwriting">Khoảnh khắc ngọt ngào</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 transition-colors"
                title="Xuất Album PDF"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-rose-100 text-rose-500 rounded-full hover:bg-rose-200 transition-colors"
              >
                <Upload size={18} />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <div ref={albumRef} className="grid grid-cols-2 gap-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 min-h-[200px]">
            {photos.length === 0 && (
              <div className="col-span-2 text-center text-gray-400 py-10 font-medium">
                Chưa có ảnh nào. Tải lên ngay! 📸
              </div>
            )}
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`group relative bg-white p-2 pb-8 rounded-sm shadow-md border border-gray-100 hover:scale-105 hover:shadow-xl hover:z-10 transition-all duration-300 ${i % 3 === 2 ? 'col-span-2 aspect-[3/2] rotate-1' : 'aspect-square -rotate-2'}`}
              >
                <img
                  src={photo}
                  alt="Love memory"
                  className="w-full h-full object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); deletePhoto(i); }}
                  className="absolute top-3 right-3 p-1.5 bg-red-500/80 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMilestoneId ? "Sửa cột mốc ✏️" : "Thêm cột mốc mới ❤️"}
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện</label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="VD: Kỷ niệm 1 năm..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <input
              type="date"
              value={newMilestone.date}
              onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biểu tượng</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(iconMap).map((iconName) => {
                const Icon = iconMap[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setNewMilestone({ ...newMilestone, iconName })}
                    className={`p-2 rounded-xl border-2 transition-all ${newMilestone.iconName === iconName ? 'border-rose-400 bg-rose-50 text-rose-500' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((colorClass) => (
                <button
                  key={colorClass}
                  type="button"
                  onClick={() => setNewMilestone({ ...newMilestone, color: colorClass })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${colorClass} ${newMilestone.color === colorClass ? 'ring-2 ring-offset-2 ring-gray-400 border-transparent' : 'border-transparent opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors mt-4"
          >
            Lưu kỷ niệm
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Xuất Album PDF 🖨️"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Chọn định dạng trang để xuất album kỷ niệm của bạn:</p>

          <div className="space-y-2">
            {[
              { id: 'auto', name: 'Tự động', desc: 'Vừa khít với kích thước album hiện tại' },
              { id: 'a4', name: 'Khổ A4', desc: '210 x 297 mm - Chuẩn in ấn thông thường' },
              { id: 'a5', name: 'Khổ A5', desc: '148 x 210 mm - Nhỏ gọn, dễ thương' },
              { id: 'letter', name: 'Khổ Letter', desc: '8.5 x 11 inches - Chuẩn quốc tế' }
            ].map(format => (
              <button
                key={format.id}
                onClick={() => setExportFormat(format.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${exportFormat === format.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                  }`}
              >
                <div>
                  <div className={`font-bold ${exportFormat === format.id ? 'text-blue-600' : 'text-gray-800'}`}>
                    {format.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{format.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${exportFormat === format.id ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                  {exportFormat === format.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={exportAlbumToPDF}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors mt-4 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Xuất file ngay
          </button>
        </div>
      </Modal>

      {isCropping && pendingPhotos.length > 0 && (
        <ImageCropper
          imageSrc={pendingPhotos[currentCropIndex]}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
