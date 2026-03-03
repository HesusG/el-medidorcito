"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { ADMIN_EMAILS } from "@/lib/constants";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const emailMatch = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase());

                let firestoreAdmin = false;
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    firestoreAdmin = userDoc.data()?.role === "admin";
                } catch {
                    // User doc may not exist yet during signup
                }

                setIsAdmin(emailMatch || firestoreAdmin);
            } else {
                setIsAdmin(false);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
