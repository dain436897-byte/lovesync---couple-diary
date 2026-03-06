import { motion } from "motion/react";
import { useState, FormEvent } from "react";
import { Plus } from "lucide-react";
import { Modal } from "./ui/Modal";

export function PiggyBank() {
  const [saved, setSaved] = useState(1200000);
  const [goal, setGoal] = useState(5000000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const progress = Math.min((saved / goal) * 100, 100);

  const handleDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setSaved(prev => prev + Number(amount));
    setAmount("");
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsModalOpen(true)}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white flex items-center gap-6 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
      >
        <div className="w-24 h-24 flex-shrink-0 bg-pink-50 rounded-full flex items-center justify-center text-5xl shadow-inner border-4 border-white group-hover:scale-110 transition-transform duration-300">
          🐷
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-end">
            <h3 className="font-bold text-xl text-gray-800 font-handwriting">Heo đất tiết kiệm</h3>
            <div className="text-xs font-semibold text-gray-500">
              <span className="text-pink-600 text-lg font-bold">{saved.toLocaleString('vi-VN')} VNĐ</span> / {goal.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>
          
          <div className="h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full relative"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20" />
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 font-handwriting">Đã tiết kiệm được một khoản kha khá rồi nè! ❤️</div>
            <div className="bg-pink-100 p-1.5 rounded-full text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} />
            </div>
          </div>
        </div>

        <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-100 rounded-full opacity-30 blur-2xl" />
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuôi heo đất 🐷"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền muốn bỏ ống</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Nhập số tiền..."
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
          >
            Bỏ ống ngay
          </button>
        </form>
      </Modal>
    </>
  );
}
