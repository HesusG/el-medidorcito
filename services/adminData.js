import { db } from "./firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    writeBatch,
    query,
    where,
    arrayUnion,
    arrayRemove,
    deleteField
} from "firebase/firestore";

export async function getAllUsers() {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

export async function getUserById(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() };
}

export async function getAllCouples() {
    const snap = await getDocs(collection(db, "couples"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getCoupleById(id) {
    const snap = await getDoc(doc(db, "couples", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
}

export async function assignUserToSpace(uid, newCoupleId, oldCoupleId) {
    const batch = writeBatch(db);

    // Remove from old couple if exists
    if (oldCoupleId) {
        const oldCoupleRef = doc(db, "couples", oldCoupleId);
        batch.update(oldCoupleRef, { members: arrayRemove(uid) });
    }

    // Add to new couple
    const newCoupleRef = doc(db, "couples", newCoupleId);
    batch.update(newCoupleRef, { members: arrayUnion(uid) });

    // Update user's coupleId
    const userRef = doc(db, "users", uid);
    batch.update(userRef, { coupleId: newCoupleId });

    await batch.commit();
}

export async function removeUserFromSpace(uid, coupleId) {
    const batch = writeBatch(db);

    const coupleRef = doc(db, "couples", coupleId);
    batch.update(coupleRef, { members: arrayRemove(uid) });

    const userRef = doc(db, "users", uid);
    batch.update(userRef, { coupleId: deleteField() });

    await batch.commit();
}

export async function deleteSpace(coupleId, memberUids) {
    const batch = writeBatch(db);

    // Clear coupleId from all members
    for (const uid of memberUids) {
        const userRef = doc(db, "users", uid);
        batch.update(userRef, { coupleId: deleteField() });
    }

    // Delete associated goals
    const goalsQ = query(collection(db, "goals"), where("coupleId", "==", coupleId));
    const goalsSnap = await getDocs(goalsQ);
    for (const goalDoc of goalsSnap.docs) {
        batch.delete(goalDoc.ref);
    }

    // Delete the couple doc
    batch.delete(doc(db, "couples", coupleId));

    await batch.commit();
}

export function computeDiagnostics(users, couples) {
    const coupleMap = new Map(couples.map(c => [c.id, c]));
    const userMap = new Map(users.map(u => [u.uid, u]));

    const orphanedUsers = []; // coupleId points to nonexistent couple
    const unpairedUsers = []; // no coupleId at all
    const orphanedCouples = []; // has ghost members (UIDs not in users)
    const emptyCouples = []; // members array empty or missing
    const soloCouples = []; // only 1 real member
    const overfullCouples = []; // more than 2 members

    for (const user of users) {
        if (!user.coupleId) {
            unpairedUsers.push(user);
        } else if (!coupleMap.has(user.coupleId)) {
            orphanedUsers.push(user);
        }
    }

    for (const couple of couples) {
        const members = couple.members || [];
        const realMembers = members.filter(uid => userMap.has(uid));
        const ghostMembers = members.filter(uid => !userMap.has(uid));

        if (ghostMembers.length > 0) {
            orphanedCouples.push({ ...couple, ghostMembers });
        }

        if (members.length === 0) {
            emptyCouples.push(couple);
        } else if (realMembers.length === 1 && ghostMembers.length === 0) {
            soloCouples.push(couple);
        }

        if (members.length > 2) {
            overfullCouples.push(couple);
        }
    }

    return {
        totalUsers: users.length,
        totalCouples: couples.length,
        orphanedUsers,
        unpairedUsers,
        orphanedCouples,
        emptyCouples,
        soloCouples,
        overfullCouples
    };
}
