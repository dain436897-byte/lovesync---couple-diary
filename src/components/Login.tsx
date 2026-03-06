import { useState, useRef, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Heart, Camera } from "lucide-react";
import { CoupleProfile } from "../types";
import { resizeImage } from "../utils/image";
import { ImageCropper } from "./ui/ImageCropper";

interface LoginProps {
  onComplete: (profile: CoupleProfile) => void;
}

export function Login({ onComplete }: LoginProps) {
  const [step, setStep] = useState(1);
  const [partner1, setPartner1] = useState({ name: "", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces" });
  const [partner2, setPartner2] = useState({ name: "", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces" });
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [currentPartnerCrop, setCurrentPartnerCrop] = useState<1 | 2 | null>(null);

  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({ partner1, partner2, startDate });
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

  const handleCropComplete = (croppedImage: string) => {
    if (currentPartnerCrop === 1) {
      setPartner1({ ...partner1, avatar: croppedImage });
    } else if (currentPartnerCrop === 2) {
      setPartner2({ ...partner2, avatar: croppedImage });
    }
    setCropImageSrc(null);
    setCurrentPartnerCrop(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-pink-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-pink-200">
          <motion.div 
            className="h-full bg-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-pink-100 rounded-full text-pink-500 mb-4">
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold font-handwriting text-gray-800">Chào mừng hai bạn! ❤️</h1>
          <p className="text-gray-500 font-medium">Hãy cùng tạo không gian riêng nhé</p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Tên của bạn</label>
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInput1Ref.current?.click()}>
                  <img src={partner1.avatar} className="w-20 h-20 rounded-full border-4 border-pink-100 object-cover shadow-md" />
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
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
                  value={partner1.name}
                  onChange={(e) => setPartner1({ ...partner1, name: e.target.value })}
                  placeholder="Nhập tên của bạn..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-50 focus:border-pink-300 outline-none transition-colors font-medium"
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!partner1.name}
              onClick={handleNext}
              className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 disabled:opacity-50 disabled:hover:scale-100 transition-colors"
            >
              Tiếp theo
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Tên người ấy</label>
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer hover:scale-105 transition-transform" onClick={() => fileInput2Ref.current?.click()}>
                  <img src={partner2.avatar} className="w-20 h-20 rounded-full border-4 border-pink-100 object-cover shadow-md" />
                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
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
                  value={partner2.name}
                  onChange={(e) => setPartner2({ ...partner2, name: e.target.value })}
                  placeholder="Nhập tên người ấy..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-pink-50 focus:border-pink-300 outline-none transition-colors font-medium"
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!partner2.name}
              onClick={handleNext}
              className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 disabled:opacity-50 disabled:hover:scale-100 transition-colors"
            >
              Tiếp theo
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Ngày bắt đầu yêu</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-pink-50 focus:border-pink-300 outline-none transition-all font-medium bg-pink-50/20 cursor-pointer"
                />
              </div>
              {startDate && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-pink-500 font-bold bg-pink-50 p-3 rounded-xl text-center shadow-sm border border-pink-100"
                >
                  ❤️ {new Date(startDate).toLocaleDateString('vi-VN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </motion.p>
              )}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors"
            >
              Bắt đầu ngay! ❤️
            </motion.button>
          </motion.div>
        )}
      </motion.div>

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
    </div>
  );
}
