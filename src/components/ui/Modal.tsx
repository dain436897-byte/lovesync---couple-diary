import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-xl z-50 border-2 border-pink-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-800 font-handwriting">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
