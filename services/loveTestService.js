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
import { calculateDimensionScores, calculatePatternScores, calculateDominantStyle } from "@/lib/loveTestScoring";

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
        version: 2,
        responses: {},
    });
    return docRef.id;
}

/**
 * Submit a user's test response (v2 — Likert + Scenarios).
 * @param {string} testId
 * @param {string} userId
 * @param {Object} likertAnswers - { q01: 4, q02: 2, ... }
 * @param {Object} scenarioAnswers - { s01: "secure", s02: "anxious", ... }
 */
export async function submitTestResponse(testId, userId, likertAnswers, scenarioAnswers) {
    const testRef = doc(db, COLLECTION, testId);
    const testSnap = await getDoc(testRef);

    if (!testSnap.exists()) throw new Error("Test not found");

    const testData = testSnap.data();
    const dimensionScores = calculateDimensionScores(likertAnswers);
    const patternScores = calculatePatternScores(scenarioAnswers);
    const { dominant, breakdown } = calculateDominantStyle(scenarioAnswers);

    const updatedResponses = {
        ...testData.responses,
        [userId]: {
            likertAnswers,
            dimensionScores,
            scenarioAnswers,
            patternScores,
            dominantStyle: dominant,
            styleBreakdown: breakdown,
            completedAt: new Date().toISOString(),
        },
    };

    const responseCount = Object.keys(updatedResponses).length;
    const newStatus = responseCount >= 2 ? "complete" : "partial";

    await updateDoc(testRef, {
        responses: updatedResponses,
        status: newStatus,
    });

    return { dimensionScores, patternScores, dominantStyle: dominant, styleBreakdown: breakdown, status: newStatus };
}

/**
 * Get the latest v2 love test for a couple.
 * @param {string} coupleId
 * @returns {Object|null} test data with id
 */
export async function getLatestLoveTest(coupleId) {
    const q = query(
        collection(db, COLLECTION),
        where("coupleId", "==", coupleId),
        where("version", "==", 2),
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
