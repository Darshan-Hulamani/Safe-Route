import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../services/firebase/firebase';

const STORAGE_KEY = 'saferoute_reports';
const REPORT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function useReports() {
  const [reports, setReports] = useState(loadFromStorage);

  // Real‑time listener with automatic cleanup
  useEffect(() => {
    const q = query(collection(db, 'danger_zones'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const now = Date.now();
        const validReports = [];
        const deletePromises = [];

        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const createdAt = data.created_at?.toDate?.() ?? new Date(data.created_at);
          const ageMs = now - createdAt.getTime();

          if (ageMs > REPORT_TTL_MS) {
            // Report is older than 24 hours → delete it
            deletePromises.push(deleteDoc(doc(db, 'danger_zones', docSnap.id)));
          } else {
            validReports.push({
              id: docSnap.id,
              ...data,
              created_at: createdAt.toISOString(),
            });
          }
        });

        // Delete old reports in the background
        await Promise.allSettled(deletePromises);

        setReports(validReports);
        saveToStorage(validReports);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setReports(loadFromStorage());
      }
    );
    return () => unsubscribe();
  }, []);

  const addReport = useCallback(async (report) => {
    const newReport = {
      latitude: report.latitude,
      longitude: report.longitude,
      type: report.type,
      description: report.description,
      user_id: 'guest',
      rating: 0,
      confirm_count: 0,
      created_at: new Date(),
    };

    try {
      await addDoc(collection(db, 'danger_zones'), newReport);
    } catch (error) {
      console.error('Firestore add report error:', error);
      const localReport = {
        ...newReport,
        id: 'local_' + Date.now(),
        created_at: new Date().toISOString(),
      };
      setReports(prev => {
        const updated = [...prev, localReport];
        saveToStorage(updated);
        return updated;
      });
      return localReport;
    }
  }, []);

  const confirmReport = useCallback(async (reportId) => {
    try {
      const reportRef = doc(db, 'danger_zones', reportId);
      await updateDoc(reportRef, { confirm_count: increment(1) });
    } catch (error) {
      console.error('Error confirming report:', error);
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, confirm_count: (r.confirm_count || 0) + 1 } : r))
      );
    }
  }, []);

  const rateReport = useCallback(async (reportId, newRating) => {
    try {
      const reportRef = doc(db, 'danger_zones', reportId);
      await updateDoc(reportRef, { rating: newRating });
    } catch (error) {
      console.error('Error rating report:', error);
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, rating: newRating } : r))
      );
    }
  }, []);

  return { reports, addReport, confirmReport, rateReport };
}