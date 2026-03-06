import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Book, Plus, CheckSquare, Square, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PiggyBank } from "./PiggyBank";
import { useFirebaseSync } from "../hooks/useFirebaseSync";

export function Dashboard() {
  const [expenseData] = useFirebaseSync<any[]>('monthly_expenses', []);
  const [tripData] = useFirebaseSync<any>('couple_trip', null);

  const packingList = tripData?.packingList || [];
  const diaryEntries = tripData?.diary?.slice(0, 2) || [];

  return (
    <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
      <PiggyBank />

      <div className="grid grid-cols-1 gap-6">
        {/* Shared Diary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
              <Book size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl text-gray-800 font-handwriting">Nhật ký chuyến đi</h3>
          </div>

          <div className="space-y-4 mb-6">
            {diaryEntries.length === 0 ? (
              <p className="text-gray-400 text-sm text-center font-medium py-2">Chưa có nhật ký nào.</p>
            ) : (
              diaryEntries.map((entry: any, i: number) => (
                <div key={i} className="bg-white/50 p-3 rounded-2xl border border-white/60">
                  <div className="text-xs text-rose-400 font-bold mb-1 uppercase tracking-wider">{entry.date}</div>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">
                    {entry.content} {entry.mood}
                  </p>
                </div>
              ))
            )}
          </div>

          <button className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2">
            <Plus size={20} strokeWidth={3} /> Xem tất cả trong tab Du lịch
          </button>
        </motion.div>

        {/* Expense Tracking Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-pink-100 text-pink-500 rounded-2xl shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-800 font-handwriting">Quản lý chi tiêu</h3>
            </div>
          </div>

          {expenseData.length > 0 ? (
            <div className="h-48 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Nunito' }}
                  />
                  <Bar dataKey="amount" fill="#fb7185" radius={[6, 6, 6, 6]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center font-medium py-8">Chưa có dữ liệu chi tiêu. Thêm trong tab Tiện ích.</p>
          )}

          <button className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all active:scale-95">
            Quản lý trong tab Tiện ích
          </button>
        </motion.div>

        {/* Packing List Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border-2 border-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-rose-100 text-rose-500 rounded-2xl shadow-sm">
              <Briefcase size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl text-gray-800 font-handwriting">Hành lý chuyến đi tới</h3>
          </div>

          <div className="space-y-3 mb-6">
            {packingList.length === 0 ? (
              <p className="text-gray-400 text-sm text-center font-medium py-2">Chưa có danh sách hành lý.</p>
            ) : (
              packingList.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl transition-colors">
                  <div className={`transition-colors ${item.checked ? 'text-rose-500' : 'text-gray-300'}`}>
                    {item.checked ? <CheckSquare size={22} weight="fill" /> : <Square size={22} />}
                  </div>
                  <span className={`text-sm font-semibold ${item.checked ? 'text-gray-400 line-through decoration-2 decoration-rose-200' : 'text-gray-600'}`}>
                    {item.text}
                  </span>
                </div>
              ))
            )}
            {packingList.length > 5 && (
              <p className="text-xs text-center text-gray-400 mt-2">Và {packingList.length - 5} mục khác...</p>
            )}
          </div>

          <button className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95">
            Quản lý danh sách trong tab Du lịch
          </button>
        </motion.div>
      </div>
    </div>
  );
}
