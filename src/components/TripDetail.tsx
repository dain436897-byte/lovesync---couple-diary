import { motion } from "motion/react";
import { Camera, Sun, MapPin, Calendar, Edit3, Image as ImageIcon } from "lucide-react";

export function TripDetail() {
  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      {/* Polaroid Photo */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mx-auto w-64 bg-white p-4 pb-12 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500 z-10 rounded-sm"
      >
        <div className="aspect-square bg-gray-100 overflow-hidden mb-4 rounded-sm border border-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=600&fit=crop" 
            alt="Couple in Phu Quoc" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center font-handwriting text-3xl text-gray-700 font-bold transform -rotate-1">Chuyến đi Phú Quốc</div>
        
        {/* Decorative tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-pink-200/60 rotate-1 shadow-sm backdrop-blur-sm" />
        
        {/* Cute sticker */}
        <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce">🌸</div>
      </motion.div>

      {/* Itinerary */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
            <Calendar size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-xl text-gray-800 font-handwriting">Lịch trình chuyến đi</h3>
        </div>

        <div className="relative pl-4 border-l-2 border-pink-200 space-y-8">
          <div className="relative group">
            <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100 group-hover:scale-125 transition-transform" />
            <h4 className="font-bold text-gray-800 mb-2">Ngày 1: Hà Nội</h4>
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white/60">
              <div className="p-2 bg-orange-100 text-orange-500 rounded-xl">
                <Camera size={18} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Check-in phố cổ, ăn phở</span>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100 group-hover:scale-125 transition-transform" />
            <h4 className="font-bold text-gray-800 mb-2">Ngày 2: Đà Nẵng</h4>
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white/60">
              <div className="p-2 bg-purple-100 text-purple-500 rounded-xl">
                <Sun size={18} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Tắm biển Mỹ Khê, ngắm cầu Rồng</span>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100 group-hover:scale-125 transition-transform" />
            <h4 className="font-bold text-gray-800 mb-2">Ngày 3: Hội An</h4>
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-2xl border border-white/60">
              <div className="p-2 bg-teal-100 text-teal-500 rounded-xl">
                <MapPin size={18} />
              </div>
              <span className="text-sm text-gray-600 font-medium">Thả đèn hoa đăng, ăn cao lầu</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trip Diary */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
            <Edit3 size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-xl text-gray-800 font-handwriting">Nhật ký hành trình</h3>
        </div>
        
        <div className="relative p-6 bg-[#fff9c4] rounded-xl shadow-sm transform -rotate-1 border border-yellow-200/50">
          <div className="absolute top-0 left-0 w-full h-8 bg-black/5 rounded-t-xl" />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-red-300/50 rotate-2" />
          
          <p className="font-handwriting text-xl text-gray-700 leading-relaxed mt-2">
            "Ngày đầu tiên ở Hội An thật tuyệt vời! Phố cổ đẹp như trong tranh vậy. Anh chụp cho em bao nhiêu là ảnh đẹp hihi."
          </p>
          <div className="absolute -bottom-2 -right-2 text-3xl animate-pulse">❤️</div>
        </div>
      </motion.div>

      {/* Trip Album */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
            <ImageIcon size={22} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-xl text-gray-800 font-handwriting">Bộ sưu tập ảnh</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:scale-105 transition-transform border-2 border-white cursor-pointer">
              <img 
                src={`https://picsum.photos/seed/vietnamtrip${i}/200/200`} 
                alt="Trip memory" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
