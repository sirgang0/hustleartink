import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Draft, Appointment } from '../types';

const DRAFTS_COLLECTION = 'drafts';
const APPOINTMENTS_COLLECTION = 'appointments';

// Save a new draft for a specific user
export const saveDraftToFirestore = async (draft: Omit<Draft, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, DRAFTS_COLLECTION), draft);
    return { ...draft, id: docRef.id };
  } catch (error) {
    console.error("Error adding draft: ", error);
    throw error;
  }
};

// Fetch all drafts belonging to a user
export const getUserDrafts = async (userId: string): Promise<Draft[]> => {
  try {
    const q = query(
      collection(db, DRAFTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const drafts: Draft[] = [];
    
    querySnapshot.forEach((doc) => {
      drafts.push({ id: doc.id, ...doc.data() } as Draft);
    });

    return drafts;
  } catch (error) {
    console.error("Error fetching drafts: ", error);
    // If index is missing, firebase throws error. 
    // Return empty or handle gracefully.
    return [];
  }
};

// Delete a draft
export const deleteDraftFromFirestore = async (draftId: string) => {
  try {
    await deleteDoc(doc(db, DRAFTS_COLLECTION, draftId));
  } catch (error) {
    console.error("Error deleting draft: ", error);
    throw error;
  }
};

// --- Appointment Functions ---

// Save a new appointment
export const createAppointment = async (appointment: Appointment) => {
  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), appointment);
    return { ...appointment, id: docRef.id };
  } catch (error) {
    console.error("Error creating appointment: ", error);
    throw error;
  }
};

// Fetch appointments for a specific artist on a specific date
export const getArtistAppointmentsOnDate = async (artistId: string, date: string): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("artistId", "==", artistId),
      where("date", "==", date),
      where("status", "!=", "cancelled")
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() } as Appointment);
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments: ", error);
    return [];
  }
};

// Fetch all appointments for a user (by email)
export const getUserAppointments = async (email: string): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where("customerEmail", "==", email),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() } as Appointment);
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching user appointments: ", error);
    return [];
  }
};
