import { Heart, Sparkles, Settings } from "lucide-react";
import { motion } from "motion/react";
import { CoupleProfile } from "../types";

interface HeaderProps {
  profile: CoupleProfile;
  onOpenSettings: () => void;
}

export function Header({ profile, onOpenSettings }: HeaderProps) {
  const calculateDays = (dateStr: string) => {
    const start = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const daysTogether = calculateDays(profile.startDate);

  return (
    <div className="w-full bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 rounded-b-[50px] p-6 text-white shadow-xl relative overflow-hidden border-b-4 border-white/20">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      
      <button 
        onClick={onOpenSettings}
        className="absolute top-6 right-6 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
      >
        <Settings size={20} />
      </button>

      <div className="relative z-10 flex items-center justify-center gap-6 pt-6 pb-4">
        {/* User 1 */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden shadow-lg bg-pink-50 relative z-10 ring-4 ring-pink-200/50">
              <img 
                src={profile.partner1.avatar} 
                alt={profile.partner1.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-white text-pink-500 rounded-full p-1 shadow-sm">
              <Heart size={12} fill="currentColor" />
            </div>
          </div>
          <span className="font-handwriting text-2xl font-bold tracking-wide drop-shadow-sm uppercase">{profile.partner1.name}</span>
        </div>

        {/* Heart & Counter */}
        <div className="flex flex-col items-center gap-1 -mt-6">
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="text-red-500 drop-shadow-xl filter"
          >
            <div className="relative">
              <Heart fill="#ef4444" size={56} strokeWidth={0} className="drop-shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart fill="#ff7b7b" size={40} strokeWidth={0} className="opacity-30" />
              </div>
            </div>
          </motion.div>
          <div className="text-center mt-1">
            <span className="block text-4xl font-handwriting font-bold drop-shadow-md text-white">{daysTogether}</span>
            <span className="text-sm font-medium opacity-95 font-handwriting text-pink-50 tracking-wider">ngày bên nhau</span>
          </div>
        </div>

        {/* User 2 */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-200 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden shadow-lg bg-pink-50 relative z-10 ring-4 ring-pink-200/50">
              <img 
                src={profile.partner2.avatar} 
                alt={profile.partner2.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-2 -left-2 bg-white text-pink-500 rounded-full p-1 shadow-sm">
              <Heart size={12} fill="currentColor" />
            </div>
          </div>
          <span className="font-handwriting text-2xl font-bold tracking-wide drop-shadow-sm uppercase">{profile.partner2.name}</span>
        </div>
      </div>
      
      {/* Decorative sparkles */}
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-6 left-10 text-yellow-200"
      >
        <Sparkles size={20} />
      </motion.div>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-10 text-yellow-200"
      >
        <Sparkles size={24} />
      </motion.div>
    </div>
  );
}
