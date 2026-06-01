import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../services/firebase/firebase';

export function useDiscussions(zoneId) {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    if (!zoneId) return;

    const q = query(
      collection(db, 'zone_discussions'),
      where('zoneId', '==', zoneId)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDiscussions(data);
    });

    return () => unsubscribe();
  }, [zoneId]);

  const addDiscussion = async (comment, rating) => {
    await addDoc(
      collection(db, 'zone_discussions'),
      {
        zoneId,
        comment,
        rating,
        created_at: Date.now()
      }
    );
  };

  return {
    discussions,
    addDiscussion
  };
}