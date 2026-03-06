import { Heart, Plane, LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BottomNavProps {
  activeTab: 'memories' | 'travel' | 'utilities';
  onTabChange: (tab: 'memories' | 'travel' | 'utilities') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <div className="max-w-md w-full mx-auto relative flex flex-col items-center pointer-events-auto">
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-md rounded-t-2xl px-6 py-1 mb-[-1px] text-gray-400 hover:text-pink-500 transition-colors z-10"
        >
          {isVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        {/* Navigation Bar */}
        <AnimatePresence initial={false}>
          {isVisible && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full p-4 pt-0"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-full shadow-xl border border-white/60 p-2 flex justify-around items-center ring-1 ring-black/5">
                <button 
                  onClick={() => onTabChange('memories')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-300 w-20",
                    activeTab === 'memories' ? "text-rose-500 bg-rose-50 scale-105 shadow-sm" : "text-gray-400 hover:text-rose-400"
                  )}
                >
                  <Heart size={24} strokeWidth={activeTab === 'memories' ? 2.5 : 2} />
                  <span className="text-[11px] font-bold">Kỷ niệm</span>
                </button>

                <button 
                  onClick={() => onTabChange('travel')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-300 w-20",
                    activeTab === 'travel' ? "text-blue-500 bg-blue-50 scale-105 shadow-sm" : "text-gray-400 hover:text-blue-400"
                  )}
                >
                  <Plane size={24} strokeWidth={activeTab === 'travel' ? 2.5 : 2} />
                  <span className="text-[11px] font-bold">Du lịch</span>
                </button>

                <button 
                  onClick={() => onTabChange('utilities')}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-300 w-20",
                    activeTab === 'utilities' ? "text-fuchsia-500 bg-fuchsia-50 scale-105 shadow-sm" : "text-gray-400 hover:text-fuchsia-400"
                  )}
                >
                  <LayoutGrid size={24} strokeWidth={activeTab === 'utilities' ? 2.5 : 2} />
                  <span className="text-[11px] font-bold">Tiện ích</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
