import { motion } from "motion/react";
import { PiggyBank } from "./PiggyBank";
import { Wallet, Plus, Target, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, FormEvent, useEffect } from "react";
import { Modal } from "./ui/Modal";

const initialExpenseData = [
  { name: 'T1', amount: 3500000 },
  { name: 'T2', amount: 2400000 },
  { name: 'T3', amount: 4600000 },
  { name: 'T4', amount: 2200000 },
  { name: 'T5', amount: 3200000 },
  { name: 'T6', amount: 4400000 },
];

export function UtilitiesTab() {
  const [expenses, setExpenses] = useState(initialExpenseData);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ month: "", amount: "" });
  const [budget, setBudget] = useState(20000000);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    const savedBudget = localStorage.getItem('monthly_budget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
    const savedExpenses = localStorage.getItem('monthly_expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('monthly_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSaveBudget = (e: FormEvent) => {
    e.preventDefault();
    if (!newBudget) return;
    const budgetValue = Number(newBudget);
    setBudget(budgetValue);
    localStorage.setItem('monthly_budget', budgetValue.toString());
    setIsBudgetModalOpen(false);
    setNewBudget("");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetPercentage = Math.min((totalExpenses / budget) * 100, 100);
  
  let progressColor = "bg-emerald-400";
  if (budgetPercentage > 100 || totalExpenses > budget) {
    progressColor = "bg-rose-500";
  } else if (budgetPercentage > 80) {
    progressColor = "bg-amber-400";
  }

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!newExpense.month || !newExpense.amount) return;
    
    setExpenses(prev => [...prev, { name: newExpense.month, amount: Number(newExpense.amount) }]);
    setNewExpense({ month: "", amount: "" });
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (index: number) => {
    setExpenses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
      {/* Piggy Bank */}
      <PiggyBank />

      {/* Expense Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 text-pink-500 rounded-2xl shadow-sm">
              <Wallet size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl text-gray-800 font-handwriting">Chi tiêu chung</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="p-2 bg-emerald-100 text-emerald-500 rounded-full hover:bg-emerald-200 transition-colors"
              title="Cài đặt ngân sách"
            >
              <Target size={18} />
            </button>
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="p-2 bg-pink-100 text-pink-500 rounded-full hover:bg-pink-200 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="mb-6 bg-white/50 p-4 rounded-2xl border border-white/60">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng chi tiêu / Ngân sách</p>
              <p className="font-bold text-gray-800">
                {totalExpenses.toLocaleString('vi-VN')} VNĐ <span className="text-gray-400 text-sm font-normal">/ {budget.toLocaleString('vi-VN')} VNĐ</span>
              </p>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold ${totalExpenses > budget ? 'text-rose-500' : 'text-emerald-500'}`}>
                {Math.round((totalExpenses / budget) * 100)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          {totalExpenses > budget && (
            <p className="text-xs text-rose-500 mt-2 font-medium">⚠️ Đã vượt quá ngân sách!</p>
          )}
        </div>

        <div className="h-40 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }} 
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="amount" fill="#fb7185" radius={[4, 4, 4, 4]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense List */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-700 text-sm mb-2">Chi tiết các khoản</h4>
          {expenses.length === 0 && (
            <div className="text-center text-gray-400 py-2 text-sm">Chưa có khoản chi tiêu nào.</div>
          )}
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-white/60 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-bold text-xs">
                  {expense.name}
                </div>
                <span className="font-bold text-gray-700">{expense.amount.toLocaleString('vi-VN')} đ</span>
              </div>
              <button 
                onClick={() => handleDeleteExpense(index)}
                className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Thêm khoản chi tiêu 💸"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tháng (VD: T7)</label>
            <input
              type="text"
              value={newExpense.month}
              onChange={(e) => setNewExpense({ ...newExpense, month: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Nhập tháng..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VNĐ)</label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Nhập số tiền..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
          >
            Lưu lại
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Cài đặt ngân sách 🎯"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách hàng tháng (VNĐ)</label>
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder={`Hiện tại: ${budget.toLocaleString('vi-VN')} VNĐ`}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
          >
            Lưu ngân sách
          </button>
        </form>
      </Modal>
    </div>
  );
}
