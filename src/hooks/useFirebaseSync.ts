import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Unifying all data under one general document for this specific app instance.
// Using a generic ID since there's no user authentication yet.
const COUPLE_ID = "lovesync_default";

export function useFirebaseSync<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
    // Load from localStorage immediately so the app doesn't flash empty content
    const [data, setData] = useState<T>(() => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : initialValue;
    });

    useEffect(() => {
        if (!db) return; // Fallback if Firebase isn't configured

        const docRef = doc(db, 'app_data', `${COUPLE_ID}_${key}`);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const serverData = docSnap.data().value;
                setData(serverData);
                // Backup to localStorage
                localStorage.setItem(key, JSON.stringify(serverData));
            } else {
                // Document doesn't exist yet on Firebase. 
                // Sync local data to Firebase if we have any.
                const localData = localStorage.getItem(key);
                if (localData) {
                    setDoc(docRef, { value: JSON.parse(localData) }, { merge: true }).catch(() => { });
                } else {
                    setDoc(docRef, { value: initialValue }, { merge: true }).catch(() => { });
                }
            }
        }, (error) => {
            console.error(`Firebase Sync Error for ${key}:`, error);
            // If permission denied or other error, app continues using localStorage
        });

        return () => unsubscribe();
    }, [key]);

    const updateData = (newValue: T | ((prev: T) => T)) => {
        setData((prev) => {
            const resolvedValue = typeof newValue === 'function' ? (newValue as Function)(prev) : newValue;

            // Update LocalStorage instantly
            localStorage.setItem(key, JSON.stringify(resolvedValue));

            // Update Firebase in the background
            if (db) {
                const docRef = doc(db, 'app_data', `${COUPLE_ID}_${key}`);
                setDoc(docRef, { value: resolvedValue }, { merge: true }).catch((error) => {
                    console.error(`Firebase Save Error for ${key}:`, error);
                });
            }

            return resolvedValue;
        });
    };

    return [data, updateData];
}
