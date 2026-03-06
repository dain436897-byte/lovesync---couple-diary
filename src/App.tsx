/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { BottomNav } from './components/BottomNav';
import { MemoriesTab } from './components/MemoriesTab';
import { TravelTab } from './components/TravelTab';
import { UtilitiesTab } from './components/UtilitiesTab';
import { Login } from './components/Login';
import { AuthGate } from './components/AuthGate';
import { SettingsModal } from './components/SettingsModal';
import { AnimatePresence, motion } from 'motion/react';
import { CoupleProfile } from './types';
import { Volume2, VolumeX } from 'lucide-react';
import { useFirebaseSync } from './hooks/useFirebaseSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<'memories' | 'travel' | 'utilities'>('memories');
  const [profile, setProfile] = useFirebaseSync<CoupleProfile | null>('couple_profile', null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const bgmRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleClick = () => {
      if (!isMuted) {
        const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-2355.mp3');
        clickSound.volume = 0.3;
        clickSound.play().catch(() => { });
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isMuted]);

  useEffect(() => {
    if (bgmRef.current) {
      if (isMuted) {
        bgmRef.current.pause();
      } else {
        bgmRef.current.play().catch(() => setIsMuted(true));
      }
    }
  }, [isMuted]);

  if (!profile) {
    return (
      <AuthGate>
        <Login onComplete={setProfile} />
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen pb-20 font-sans text-gray-800 selection:bg-pink-200 bg-pink-50/30">
        <main className="relative z-0">
          <AnimatePresence mode="wait">
            {activeTab === 'memories' && (
              <motion.div
                key="memories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MemoriesTab profile={profile} onOpenSettings={() => setIsSettingsOpen(true)} />
              </motion.div>
            )}

            {activeTab === 'travel' && (
              <motion.div
                key="travel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TravelTab />
              </motion.div>
            )}

            {activeTab === 'utilities' && (
              <motion.div
                key="utilities"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <UtilitiesTab />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
          onUpdate={setProfile}
        />

        <button
          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          className="fixed bottom-24 right-4 p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-white/50 text-gray-500 hover:text-pink-500 opacity-60 hover:opacity-100 transition-all z-50"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        {/* Background Music - A cute royalty-free track */}
        <audio
          ref={bgmRef}
          src="https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3"
          loop
        />
      </div>
    </AuthGate>
  );
}

