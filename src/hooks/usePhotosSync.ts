import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, setDoc, deleteDoc, updateDoc, doc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COUPLE_ID = "lovesync_default";

export interface PhotoItem {
    id: string;
    url: string;
    note: string;
    createdAt: number;
}

/**
 * Stores photos as individual Firestore documents in a sub-collection.
 * Each photo is its own document so we avoid the 1MB document size limit.
 */
export function usePhotosSync() {
    const [photoItems, setPhotoItems] = useState<PhotoItem[]>(() => {
        try {
            const saved = localStorage.getItem('couple_photos_v2');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        if (!db) return;

        const colRef = collection(db, 'app_data', COUPLE_ID, 'photos');
        const q = query(colRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: PhotoItem[] = snapshot.docs.map(d => ({
                id: d.id,
                url: d.data().url as string,
                note: (d.data().note as string) || '',
                createdAt: d.data().createdAt as number,
            }));
            setPhotoItems(items);
            localStorage.setItem('couple_photos_v2', JSON.stringify(items));
        }, (error) => {
            console.error('Photos sync error:', error);
        });

        return () => unsubscribe();
    }, []);

    const addPhoto = useCallback(async (url: string, note = '') => {
        let id = `temp_${Date.now()}`;
        if (db) {
            id = doc(collection(db, 'app_data', COUPLE_ID, 'photos')).id;
        }
        const newItem: PhotoItem = { id, url, note, createdAt: Date.now() };

        // Optimistic update
        setPhotoItems(prev => {
            const next = [newItem, ...prev];
            localStorage.setItem('couple_photos_v2', JSON.stringify(next));
            return next;
        });

        if (db) {
            try {
                await setDoc(doc(db, 'app_data', COUPLE_ID, 'photos', id), { url, note, createdAt: newItem.createdAt });
            } catch (error) {
                console.error('Failed to save photo to Firestore:', error);
            }
        }
    }, []);

    const updatePhotoNote = useCallback(async (id: string, note: string) => {
        setPhotoItems(prev => {
            const next = prev.map(p => p.id === id ? { ...p, note } : p);
            localStorage.setItem('couple_photos_v2', JSON.stringify(next));
            return next;
        });

        if (db) {
            try {
                await setDoc(doc(db, 'app_data', COUPLE_ID, 'photos', id), { note }, { merge: true });
            } catch (error) {
                console.error('Failed to update photo note:', error);
            }
        }
    }, []);

    const updatePhotoUrl = useCallback(async (id: string, url: string) => {
        setPhotoItems(prev => {
            const next = prev.map(p => p.id === id ? { ...p, url } : p);
            localStorage.setItem('couple_photos_v2', JSON.stringify(next));
            return next;
        });

        if (db) {
            try {
                await setDoc(doc(db, 'app_data', COUPLE_ID, 'photos', id), { url }, { merge: true });
            } catch (error) {
                console.error('Failed to update photo url:', error);
            }
        }
    }, []);

    const deletePhoto = useCallback(async (id: string) => {
        setPhotoItems(prev => {
            const next = prev.filter(p => p.id !== id);
            localStorage.setItem('couple_photos_v2', JSON.stringify(next));
            return next;
        });

        if (db) {
            try {
                await deleteDoc(doc(db, 'app_data', COUPLE_ID, 'photos', id));
            } catch (error) {
                console.error('Failed to delete photo from Firestore:', error);
            }
        }
    }, []);

    return { photoItems, addPhoto, updatePhotoNote, updatePhotoUrl, deletePhoto };
}
