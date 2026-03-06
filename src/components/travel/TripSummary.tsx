import React from "react";
import { ArrowLeft, Calendar, DollarSign, MapPin, Clock, CheckCircle2, Plane, Coffee, Utensils, Bed, Car, Train, Map, ShoppingBag, Music } from "lucide-react";
import { ItineraryItem } from "./TripItinerary";

interface TripSummaryProps {
    trip: {
        destination: string;
        startDate: string;
        endDate: string;
        time: string;
        budget: number;
        image?: string;
        itinerary: ItineraryItem[];
    };
    onBack: () => void;
}

export function TripSummary({ trip, onBack }: TripSummaryProps) {
    const { itinerary } = trip;

    // Group by day
    const groupedByDay = itinerary.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
    }, {} as Record<number, ItineraryItem[]>);

    const getActivityIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('bay') || lower.includes('sân bay')) return Plane;
        if (lower.includes('khách sạn') || lower.includes('resort') || lower.includes('ngủ') || lower.includes('nhận phòng')) return Bed;
        if (lower.includes('ăn') || lower.includes('nhà hàng') || lower.includes('bữa')) return Utensils;
        if (lower.includes('cafe') || lower.includes('trà') || lower.includes('coffee')) return Coffee;
        if (lower.includes('xe') || lower.includes('taxi') || lower.includes('bus')) return Car;
        if (lower.includes('tàu')) return Train;
        if (lower.includes('mua sắm') || lower.includes('chợ')) return ShoppingBag;
        if (lower.includes('chơi') || lower.includes('công viên') || lower.includes('nhạc') || lower.includes('bar')) return Music;
        return Map;
    };

    const totalCost = itinerary.reduce((sum, i) => sum + (i.cost || 0), 0);
    const totalDone = itinerary.filter(i => i.done).length;
    const hasPhotos = itinerary.some(i => i.photo);

    return (
        <div className="pb-24 space-y-6 pt-6 px-4 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 rounded-full transition-colors shadow-sm">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold font-serif text-gray-800">Tổng kết chuyến đi</h2>
            </div>

            {/* Hero image */}
            {trip.image && (
                <div className="relative w-full h-44 rounded-3xl overflow-hidden shadow-lg">
                    <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 text-white">
                        <h3 className="text-2xl font-bold font-serif leading-tight mb-1">{trip.destination}</h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs opacity-80">
                            <span className="flex items-center gap-1"><Calendar size={10} />{trip.startDate} – {trip.endDate}</span>
                            <span className="flex items-center gap-1"><Clock size={10} />{trip.time}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/80 rounded-2xl p-3 text-center shadow-sm border border-white">
                    <p className="text-2xl font-bold text-emerald-500">{totalCost.toLocaleString('vi-VN')}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Tổng chi phí (đ)</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-3 text-center shadow-sm border border-white">
                    <p className="text-2xl font-bold text-blue-500">{itinerary.length}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Hoạt động</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-3 text-center shadow-sm border border-white">
                    <p className="text-2xl font-bold text-rose-500">{totalDone}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Đã hoàn thành</p>
                </div>
            </div>

            {/* Budget comparison */}
            {trip.budget > 0 && (
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white">
                    <p className="text-sm font-semibold text-gray-700 mb-2">💰 Ngân sách</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đã chi: <strong className="text-emerald-600">{totalCost.toLocaleString('vi-VN')}đ</strong></span>
                        <span>Dự kiến: <strong className="text-gray-700">{trip.budget.toLocaleString('vi-VN')}đ</strong></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${totalCost > trip.budget ? 'bg-red-400' : 'bg-emerald-400'}`}
                            style={{ width: `${Math.min((totalCost / trip.budget) * 100, 100)}%` }}
                        />
                    </div>
                    {totalCost > trip.budget && (
                        <p className="text-xs text-red-500 mt-1">Đã vượt ngân sách {(totalCost - trip.budget).toLocaleString('vi-VN')}đ</p>
                    )}
                    {totalCost <= trip.budget && (
                        <p className="text-xs text-emerald-500 mt-1">Còn lại {(trip.budget - totalCost).toLocaleString('vi-VN')}đ</p>
                    )}
                </div>
            )}

            {/* Day by day breakdown */}
            <div className="space-y-4">
                {Object.entries(groupedByDay).map(([day, dayItems]) => {
                    const dayCost = dayItems.reduce((s, i) => s + (i.cost || 0), 0);
                    const dayPhotos = dayItems.filter(i => i.photo);

                    return (
                        <div key={day} className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-white">
                            {/* Day header */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 flex items-center justify-between border-b border-green-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-white text-sm font-bold">{day}</div>
                                    <span className="font-bold text-gray-800 font-serif">Ngày {day}</span>
                                </div>
                                {dayCost > 0 && (
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        {dayCost.toLocaleString('vi-VN')}đ
                                    </span>
                                )}
                            </div>

                            {/* Activities */}
                            <div className="divide-y divide-gray-50">
                                {dayItems.map(item => (
                                    <div key={item.id} className={`px-4 py-3 ${item.done ? 'opacity-60' : ''}`}>
                                        <div className="flex items-start gap-2">
                                            {item.done
                                                ? <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                                : <div className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                                            }
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-1">
                                                    <Clock size={10} />{item.time}
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    {React.createElement(getActivityIcon(item.activity), { size: 13, className: "text-gray-400 flex-shrink-0" })}
                                                    <p className={`text-sm font-semibold text-gray-800 leading-tight ${item.done ? 'line-through text-gray-400' : ''}`}>{item.activity}</p>
                                                </div>
                                                {item.location && (
                                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                                        <MapPin size={10} />{item.location}
                                                    </div>
                                                )}
                                                {(item.cost || item.costNote) && (
                                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-emerald-600">
                                                        <DollarSign size={10} />
                                                        {item.cost ? <span className="font-semibold">{item.cost.toLocaleString('vi-VN')}đ</span> : ''}
                                                        {item.costNote && <span className="text-gray-400 ml-1">{item.costNote}</span>}
                                                    </div>
                                                )}
                                                {item.photo && (
                                                    <img src={item.photo} alt="memory" className="mt-2.5 h-20 w-32 object-cover rounded-xl shadow-sm border border-gray-100" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Day photo gallery strip */}
                            {dayPhotos.length > 0 && (
                                <div className="px-4 pb-3">
                                    <p className="text-xs text-gray-400 mb-2">📸 Kỷ niệm ngày {day}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {dayPhotos.map(p => (
                                            <img key={p.id} src={p.photo} alt="memory" className="h-16 w-20 object-cover rounded-xl border border-gray-100 shadow-sm" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {itinerary.length === 0 && (
                <div className="text-center text-gray-400 py-16">Chưa có hoạt động nào để tổng kết 📋</div>
            )}
        </div>
    );
}
