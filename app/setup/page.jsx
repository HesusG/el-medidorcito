"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { db } from "@/services/firebase";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp, collection, addDoc } from "firebase/firestore";

export default function SetupPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mode, setMode] = useState("create"); // 'create' | 'join'
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (!loading && user) {
            // Check if already has couple
            const checkProfile = async () => {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().coupleId) {
                    router.push("/dashboard");
                }
            };
            checkProfile();
        }
    }, [user, loading, router]);

    const handleCreate = async () => {
        setError("");
        setIsSubmitting(true);
        try {
            // Create couple doc with auto ID
            const coupleRef = await addDoc(collection(db, "couples"), {
                members: [user.uid],
                createdAt: serverTimestamp(),
            });

            // Update user with coupleId
            await updateDoc(doc(db, "users", user.uid), {
                coupleId: coupleRef.id
            });

            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Error al crear el espacio. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setError("");
        setIsSubmitting(true);
        try {
            const coupleRef = doc(db, "couples", joinCode.trim());
            const coupleSnap = await getDoc(coupleRef);

            if (!coupleSnap.exists()) {
                setError("El código de pareja no existe.");
                setIsSubmitting(false);
                return;
            }

            const data = coupleSnap.data();
            if (data.members.length >= 2) {
                setError("Este espacio ya está lleno (2 personas máx).");
                setIsSubmitting(false);
                return;
            }

            if (data.members.includes(user.uid)) {
                // Already joined
                await updateDoc(doc(db, "users", user.uid), { coupleId: joinCode.trim() });
                router.push("/dashboard");
                return;
            }

            // Add user to couple
            await updateDoc(coupleRef, {
                members: arrayUnion(user.uid)
            });

            // Update user profile
            await updateDoc(doc(db, "users", user.uid), {
                coupleId: joinCode.trim()
            });

            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Error al unirse. Verifica el código.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-lg space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
                        Configura tu Espacio
                    </h1>
                    <p className="text-gray-600">
                        El Medidorcito es mejor de a dos.
                    </p>
                </div>

                <div className="flex border-2 border-black p-1 gap-1">
                    <button
                        onClick={() => setMode("create")}
                        className={`flex-1 py-2 font-bold transition-all ${mode === "create" ? "bg-primary" : "hover:bg-gray-100"}`}
                    >
                        CREAR NUEVO
                    </button>
                    <button
                        onClick={() => setMode("join")}
                        className={`flex-1 py-2 font-bold transition-all ${mode === "join" ? "bg-secondary" : "hover:bg-gray-100"}`}
                    >
                        UNIRME
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-2 border-danger text-danger p-3 font-bold text-sm">
                        {error}
                    </div>
                )}

                {mode === "create" ? (
                    <div className="space-y-4 text-center">
                        <div className="bg-yellow-50 border-2 border-primary p-4 mb-4">
                            <p className="font-medium mb-2">Crea un espacio para ti y tu pareja.</p>
                            <p className="text-sm">Te daremos un código para que se lo pases.</p>
                        </div>
                        <Button onClick={handleCreate} isLoading={isSubmitting} className="w-full" size="lg">
                            CREAR ESPACIO
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="bg-orange-50 border-2 border-secondary p-4 mb-4">
                            <p className="font-medium text-center">Ingresa el código que te dio tu pareja.</p>
                        </div>
                        <Input
                            label="Código de Pareja"
                            placeholder="Ej: 8SD9ds"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            required
                        />
                        <Button variant="secondary" type="submit" className="w-full" isLoading={isSubmitting} size="lg">
                            UNIRME
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
