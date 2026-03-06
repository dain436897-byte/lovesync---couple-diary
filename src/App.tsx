/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { MemoriesTab } from './components/MemoriesTab';
import { TravelTab } from './components/TravelTab';
import { UtilitiesTab } from './components/UtilitiesTab';
import { Login } from './components/Login';
import { AuthGate } from './components/AuthGate';
import { SettingsModal } from './components/SettingsModal';
import { AnimatePresence, motion } from 'motion/react';
import { CoupleProfile } from './types';
import { useFirebaseSync } from './hooks/useFirebaseSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<'memories' | 'travel' | 'utilities'>('memories');
  const [profile, setProfile] = useFirebaseSync<CoupleProfile | null>('couple_profile', null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      </div>
    </AuthGate>
  );
}
