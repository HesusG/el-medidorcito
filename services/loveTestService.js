import { db } from "./firebase";
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
} from "firebase/firestore";
import { calculateDimensionScores } from "@/lib/loveTestScoring";

const COLLECTION = "loveTests";

/**
 * Create a new love test for a couple.
 * @param {string} coupleId
 * @param {string} userId - the user who initiates the test
 * @returns {string} testId
 */
export async function createLoveTest(coupleId, userId) {
    const docRef = await addDoc(collection(db, COLLECTION), {
        coupleId,
        createdBy: userId,
        createdAt: serverTimestamp(),
        status: "pending",
        version: 1,
        responses: {},
    });
    return docRef.id;
}

/**
 * Submit a user's test response.
 * @param {string} testId
 * @param {string} userId
 * @param {Object} answers - { q01: 4, q02: 2, ... }
 */
export async function submitTestResponse(testId, userId, answers) {
    const testRef = doc(db, COLLECTION, testId);
    const testSnap = await getDoc(testRef);

    if (!testSnap.exists()) throw new Error("Test not found");

    const testData = testSnap.data();
    const dimensionScores = calculateDimensionScores(answers);

    const updatedResponses = {
        ...testData.responses,
        [userId]: {
            answers,
            dimensionScores,
            completedAt: new Date().toISOString(),
        },
    };

    // Check if both partners have responded
    const responseCount = Object.keys(updatedResponses).length;
    const newStatus = responseCount >= 2 ? "complete" : "pending";

    await updateDoc(testRef, {
        responses: updatedResponses,
        status: newStatus,
    });

    return { dimensionScores, status: newStatus };
}

/**
 * Get the latest love test for a couple.
 * @param {string} coupleId
 * @returns {Object|null} test data with id
 */
export async function getLatestLoveTest(coupleId) {
    const q = query(
        collection(db, COLLECTION),
        where("coupleId", "==", coupleId),
        orderBy("createdAt", "desc"),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
}

/**
 * Get a specific love test by ID.
 * @param {string} testId
 * @returns {Object|null}
 */
export async function getLoveTest(testId) {
    const docSnap = await getDoc(doc(db, COLLECTION, testId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
}
