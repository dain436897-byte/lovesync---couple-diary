import { motion, AnimatePresence } from "motion/react";
import { useState, FormEvent } from "react";
import { Plus, Minus, Target, Trash2, PiggyBank as PiggyIcon, TrendingUp } from "lucide-react";
import { Modal } from "./ui/Modal";
import { useFirebaseSync } from "../hooks/useFirebaseSync";

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw';
  amount: number;
  note: string;
  date: string;
}

interface PiggyData {
  saved: number;
  goal: number;
  goalName: string;
  transactions: Transaction[];
}

const initialData: PiggyData = {
  saved: 1200000,
  goal: 5000000,
  goalName: "Chuyến du lịch cùng nhau 🌴",
  transactions: [
    { id: 1, type: 'deposit', amount: 500000, note: "Bỏ ống đầu tiên", date: "2026-01-01" },
    { id: 2, type: 'deposit', amount: 700000, note: "Tháng 2", date: "2026-02-01" },
  ]
};

const MOTIVATION: Record<string, string> = {
  low: "Hãy bắt đầu từ những đồng nhỏ! 🌱",
  mid: "Đang tiến đến mục tiêu rồi! 💪",
  high: "Gần đến đích rồi! Cố lên! 🔥",
  done: "Đã đạt mục tiêu! Xứng đáng đi chơi! 🎉",
};

export function PiggyBank() {
  const [data, setData] = useFirebaseSync<PiggyData>('piggy_bank', initialData);

  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | 'goal' | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [newGoal, setNewGoal] = useState({ amount: "", name: "" });

  const progress = Math.min((data.saved / data.goal) * 100, 100);
  const progressLevel = progress >= 100 ? 'done' : progress >= 70 ? 'high' : progress >= 30 ? 'mid' : 'low';

  const piggyFill = Math.floor(progress / 25); // 0-4 level for piggy color
  const piggyColors = ['🐷', '🐷', '😊🐷', '😄🐷', '🎉🐷'];

  const handleDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const num = Number(amount);
    const tx: Transaction = {
      id: Date.now(),
      type: 'deposit',
      amount: num,
      note: note || "Bỏ ống",
      date: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({ ...prev, saved: prev.saved + num, transactions: [tx, ...prev.transactions] }));
    setAmount(""); setNote(""); setModalType(null);
  };

  const handleWithdraw = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const num = Math.min(Number(amount), data.saved);
    const tx: Transaction = {
      id: Date.now(),
      type: 'withdraw',
      amount: num,
      note: note || "Rút tiền",
      date: new Date().toISOString().split('T')[0],
    };
    setData(prev => ({ ...prev, saved: Math.max(0, prev.saved - num), transactions: [tx, ...prev.transactions] }));
    setAmount(""); setNote(""); setModalType(null);
  };

  const handleGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!newGoal.amount) return;
    setData(prev => ({ ...prev, goal: Number(newGoal.amount), goalName: newGoal.name || prev.goalName }));
    setNewGoal({ amount: "", name: "" }); setModalType(null);
  };

  const deleteTransaction = (id: number) => {
    const tx = data.transactions.find(t => t.id === id);
    if (!tx) return;
    const delta = tx.type === 'deposit' ? -tx.amount : tx.amount;
    setData(prev => ({
      ...prev,
      saved: Math.max(0, prev.saved + delta),
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white overflow-hidden relative"
      >
        {/* Background sparkles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-yellow-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-pink-200/40 rounded-full blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 text-pink-500 rounded-2xl shadow-sm">
              <PiggyIcon size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 font-handwriting leading-none">Hũ Heo Tiết Kiệm</h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{data.goalName}</p>
            </div>
          </div>
          <button
            onClick={() => { setNewGoal({ amount: data.goal.toString(), name: data.goalName }); setModalType('goal'); }}
            className="p-2 bg-white/60 text-gray-400 hover:text-emerald-500 rounded-full transition-colors"
          >
            <Target size={16} />
          </button>
        </div>

        {/* Piggy visual + stats */}
        <div className="flex items-center gap-5 mb-5 relative z-10">
          <motion.div
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.6 }}
            className="w-20 h-20 flex-shrink-0 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border-2 border-pink-100"
          >
            {piggyColors[piggyFill]}
          </motion.div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-gray-400 font-medium">Đã tiết kiệm</span>
              <span className="text-xs font-bold text-pink-500">{Math.round(progress)}%</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 leading-none mb-2">
              {data.saved.toLocaleString('vi-VN')}<span className="text-sm text-gray-400 font-normal ml-1">đ</span>
            </p>
            <p className="text-xs text-gray-400">Mục tiêu: <span className="font-semibold text-gray-600">{data.goal.toLocaleString('vi-VN')}đ</span></p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mb-4">
          <div className="h-4 bg-white/60 rounded-full overflow-hidden shadow-inner border border-white">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full relative ${progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : progress >= 70 ? 'bg-gradient-to-r from-orange-400 to-rose-400'
                    : 'bg-gradient-to-r from-pink-400 to-rose-400'
                }`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
              {/* Coin emoji marker */}
              {progress > 5 && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px]">🪙</span>
              )}
            </motion.div>
          </div>
          {/* Milestone ticks */}
          <div className="flex justify-between mt-1 px-0.5">
            {[25, 50, 75, 100].map(pct => (
              <div key={pct} className="flex flex-col items-center">
                <div className={`w-0.5 h-1.5 rounded-full ${progress >= pct ? 'bg-pink-400' : 'bg-gray-200'}`} />
                <span className="text-[9px] text-gray-300">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation message */}
        <p className="text-xs text-center text-gray-500 italic mb-5 relative z-10">{MOTIVATION[progressLevel]}</p>

        {/* Remaining */}
        {progress < 100 && (
          <div className="bg-white/50 rounded-2xl p-3 mb-5 flex justify-between items-center relative z-10">
            <span className="text-xs text-gray-500">Còn cần thêm</span>
            <span className="font-bold text-rose-500">{Math.max(0, data.goal - data.saved).toLocaleString('vi-VN')}đ</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => { setAmount(""); setNote(""); setModalType('deposit'); }}
            className="flex-1 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Bỏ ống
          </button>
          <button
            onClick={() => { setAmount(""); setNote(""); setModalType('withdraw'); }}
            disabled={data.saved === 0}
            className="flex-1 py-3 bg-white text-gray-600 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all border border-gray-100 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Minus size={16} /> Rút ra
          </button>
        </div>

        {/* Recent transactions */}
        {data.transactions.length > 0 && (
          <div className="mt-5 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-gray-400" />
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lịch sử giao dịch</h4>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {data.transactions.slice(0, 10).map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 bg-white/60 rounded-xl p-2.5 group"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${tx.type === 'deposit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {tx.type === 'deposit' ? '💰' : '💸'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{tx.note}</p>
                      <p className="text-[10px] text-gray-400">{tx.date}</p>
                    </div>
                    <span className={`text-xs font-bold flex-shrink-0 ${tx.type === 'deposit' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}đ
                    </span>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 md:opacity-0 opacity-100 p-1 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Deposit Modal */}
      <Modal isOpen={modalType === 'deposit'} onClose={() => setModalType(null)} title="Bỏ ống tiết kiệm 🐷💰">
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (đ)</label>
            <input
              autoFocus type="number" min="1" value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg font-bold"
              placeholder="Nhập số tiền..."
            />
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 flex-wrap">
            {[50000, 100000, 200000, 500000].map(q => (
              <button key={q} type="button" onClick={() => setAmount(q.toString())}
                className="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-xl text-xs font-bold hover:bg-pink-100 transition-colors border border-pink-100">
                +{(q / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Tùy chọn)</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="VD: Tháng 3, Bonus, Tiết kiệm cuối tuần..." />
          </div>
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md">
            Bỏ ống ngay 🪙
          </button>
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={modalType === 'withdraw'} onClose={() => setModalType(null)} title="Rút tiền heo đất 💸">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">Hiện có trong hũ</p>
          <p className="text-2xl font-bold text-pink-500">{data.saved.toLocaleString('vi-VN')}đ</p>
        </div>
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền rút (đ)</label>
            <input
              autoFocus type="number" min="1" max={data.saved} value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300 text-lg font-bold"
              placeholder="Nhập số tiền..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lý do rút</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="VD: Mua vé máy bay, Đặt khách sạn..." />
          </div>
          <button type="submit" className="w-full py-3 bg-red-400 text-white rounded-xl font-bold hover:bg-red-500 transition-colors">
            Rút tiền
          </button>
        </form>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={modalType === 'goal'} onClose={() => setModalType(null)} title="Đặt mục tiêu tiết kiệm 🎯">
        <form onSubmit={handleGoal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên mục tiêu</label>
            <input type="text" value={newGoal.name}
              onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="VD: Chuyến du lịch Hội An 🏖️" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu số tiền (đ)</label>
            <input
              autoFocus type="number" min="1" value={newGoal.amount}
              onChange={e => setNewGoal(p => ({ ...p, amount: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-lg font-bold"
              placeholder="Nhập số tiền mục tiêu..." />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">
            Cập nhật mục tiêu 🎯
          </button>
        </form>
      </Modal>
    </>
  );
}
