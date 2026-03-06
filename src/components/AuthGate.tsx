import { useState, useEffect, ReactNode, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

const CREDENTIALS = {
    username: "MLynkXynh",
    password: "Matkhau1@23!",
};
const SESSION_KEY = "lovesync_auth";

interface AuthGateProps {
    children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem(SESSION_KEY);
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate a tiny delay for UX feel
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (
            username === CREDENTIALS.username &&
            password === CREDENTIALS.password
        ) {
            sessionStorage.setItem(SESSION_KEY, "true");
            setIsAuthenticated(true);
        } else {
            setError(
                username !== CREDENTIALS.username
                    ? "Tên tài khoản không đúng 💔"
                    : "Mật khẩu không chính xác 💔"
            );
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
        }
        setIsLoading(false);
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-100 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative floating hearts */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-pink-200 select-none pointer-events-none"
                    style={{
                        left: `${10 + i * 16}%`,
                        top: `${15 + (i % 3) * 25}%`,
                        fontSize: `${1.2 + (i % 3) * 0.6}rem`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.7, 0.3],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                    }}
                >
                    ❤️
                </motion.div>
            ))}

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm relative"
            >
                {/* Card */}
                <motion.div
                    animate={isShaking ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/60 ring-1 ring-pink-100"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-[1.5rem] shadow-xl shadow-pink-300/50 mb-4 relative"
                        >
                            <Heart size={36} fill="white" className="text-white" />
                            <motion.div
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute -top-1 -right-1"
                            >
                                <Sparkles size={16} className="text-yellow-300" />
                            </motion.div>
                        </motion.div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            LoveSync
                        </h1>
                        <p className="text-gray-400 text-sm mt-1 font-medium">
                            Không gian riêng của hai bạn 💕
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Tài khoản
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Nhập tài khoản..."
                                    autoComplete="username"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-pink-50 bg-pink-50/50 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Nhập mật khẩu..."
                                    autoComplete="current-password"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-pink-50 bg-pink-50/50 focus:border-pink-300 focus:bg-white outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -5, height: 0 }}
                                    className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold rounded-xl px-4 py-2.5 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-300/50 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    Đang kiểm tra...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Heart size={18} fill="white" />
                                    Vào nhật ký của chúng mình
                                </span>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-300 mt-6 font-medium">
                        Chỉ dành riêng cho hai bạn 🔒
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
