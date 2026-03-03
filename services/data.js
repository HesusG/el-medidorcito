import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export async function getCoupleGoalsWithScores(coupleId, currentUserId) {
    const q = query(
        collection(db, "goals"),
        where("coupleId", "==", coupleId),
        where("active", "==", true)
    );
    const querySnapshot = await getDocs(q);

    const goalsData = [];

    for (const docSnap of querySnapshot.docs) {
        const goal = { id: docSnap.id, ...docSnap.data() };

        // Fetch recent checkins
        const checkinsRef = collection(db, "goals", goal.id, "checkins");
        const checkinsQ = query(checkinsRef, orderBy("weekKey", "desc"), limit(10));
        const checkinsSnap = await getDocs(checkinsQ);
        const checkins = checkinsSnap.docs.map(d => d.data());

        // Process scores
        const myCheckins = checkins.filter(c => c.uid === currentUserId);
        const partnerCheckins = checkins.filter(c => c.uid !== currentUserId);

        const myLatest = myCheckins[0];
        const partnerLatest = partnerCheckins[0];

        const myPrev = myCheckins[1];
        const partnerPrev = partnerCheckins[1];

        // Calc Trend
        const getTrend = (curr, prev) => {
            if (!curr || !prev) return "flat";
            if (curr.score > prev.score) return "up";
            if (curr.score < prev.score) return "down";
            return "flat";
        };

        goalsData.push({
            ...goal,
            myScore: myLatest?.score || 0,
            partnerScore: partnerLatest?.score || 0,
            gap: Math.abs((myLatest?.score || 0) - (partnerLatest?.score || 0)),
            trend: {
                me: getTrend(myLatest, myPrev),
                partner: getTrend(partnerLatest, partnerPrev)
            }
        });
    }

    return goalsData;
}
