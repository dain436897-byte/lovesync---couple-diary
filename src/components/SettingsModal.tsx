import { useState, useRef, ChangeEvent } from "react";
import { Modal } from "./ui/Modal";
import { CoupleProfile } from "../types";
import { Camera, Heart, LogOut } from "lucide-react";
import { resizeImage } from "../utils/image";
import { ImageCropper } from "./ui/ImageCropper";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onUpdate: (profile: CoupleProfile) => void;
}

export function SettingsModal({ isOpen, onClose, profile, onUpdate }: SettingsModalProps) {
  const [tempProfile, setTempProfile] = useState<CoupleProfile>(profile);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [currentPartnerCrop, setCurrentPartnerCrop] = useState<1 | 2 | null>(null);

  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(tempProfile);
    onClose();
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất? Mọi dữ liệu sẽ bị xóa.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, partner: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setCurrentPartnerCrop(partner);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImage: string) => {
    try {
      const { compressImage } = await import('../lib/imageUtils');
      const compressed = await compressImage(croppedImage, 150, 400);
      if (currentPartnerCrop === 1) {
        setTempProfile({ ...tempProfile, partner1: { ...tempProfile.partner1, avatar: compressed } });
      } else if (currentPartnerCrop === 2) {
        setTempProfile({ ...tempProfile, partner2: { ...tempProfile.partner2, avatar: compressed } });
      }
    } catch {
      if (currentPartnerCrop === 1) {
        setTempProfile({ ...tempProfile, partner1: { ...tempProfile.partner1, avatar: croppedImage } });
      } else if (currentPartnerCrop === 2) {
        setTempProfile({ ...tempProfile, partner2: { ...tempProfile.partner2, avatar: croppedImage } });
      }
    }
    setCropImageSrc(null);
    setCurrentPartnerCrop(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cài đặt không gian ❤️">
      <div className="space-y-6">
        {/* Partner 1 */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bạn</label>
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInput1Ref.current?.click()}>
              <img src={tempProfile.partner1.avatar} className="w-16 h-16 rounded-full border-4 border-pink-100 object-cover shadow-sm" />
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              <input
                type="file"
                ref={fileInput1Ref}
                onChange={(e) => handleFileUpload(e, 1)}
                accept="image/*"
                className="hidden"
              />
            </div>
            <input
              type="text"
              value={tempProfile.partner1.name}
              onChange={(e) => setTempProfile({ ...tempProfile, partner1: { ...tempProfile.partner1, name: e.target.value } })}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-200 outline-none font-medium"
            />
          </div>
        </div>

        {/* Partner 2 */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Người ấy</label>
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInput2Ref.current?.click()}>
              <img src={tempProfile.partner2.avatar} className="w-16 h-16 rounded-full border-4 border-pink-100 object-cover shadow-sm" />
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              <input
                type="file"
                ref={fileInput2Ref}
                onChange={(e) => handleFileUpload(e, 2)}
                accept="image/*"
                className="hidden"
              />
            </div>
            <input
              type="text"
              value={tempProfile.partner2.name}
              onChange={(e) => setTempProfile({ ...tempProfile, partner2: { ...tempProfile.partner2, name: e.target.value } })}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-100 focus:border-pink-200 outline-none font-medium"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ngày bắt đầu yêu</label>
          <div className="relative">
            <input
              type="date"
              value={tempProfile.startDate}
              onChange={(e) => setTempProfile({ ...tempProfile, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-pink-200 outline-none font-medium bg-pink-50/30 transition-all cursor-pointer"
            />
          </div>
          {tempProfile.startDate && (
            <p className="text-xs text-pink-500 font-medium bg-pink-50 p-2 rounded-lg text-center">
              Đã chọn: {new Date(tempProfile.startDate).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-md hover:bg-pink-600 transition-colors"
          >
            Lưu thay đổi
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropImageSrc(null);
            setCurrentPartnerCrop(null);
          }}
          aspectRatio={1}
        />
      )}
    </Modal>
  );
}
