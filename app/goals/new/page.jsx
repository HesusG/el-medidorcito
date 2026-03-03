"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CARD_COLORS = [
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Rosa", value: "#FFE5EC" },
    { name: "Morado", value: "#F3E5FF" },
    { name: "Azul", value: "#E5F3FF" },
    { name: "Verde", value: "#E5FFE5" },
    { name: "Amarillo", value: "#FFFDE5" }
];

export default function NewGoalPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [goalType, setGoalType] = useState("rating"); // 'rating' | 'ongoing'
    const [targetDate, setTargetDate] = useState("");
    const [tactics, setTactics] = useState([""]); // Start with one empty tactic
    const [cardColor, setCardColor] = useState("#FFFFFF");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coupleId, setCoupleId] = useState(null);

    const addTactic = () => setTactics([...tactics, ""]);
    const removeTactic = (index) => setTactics(tactics.filter((_, i) => i !== index));
    const updateTactic = (index, value) => {
        const newTactics = [...tactics];
        newTactics[index] = value;
        setTactics(newTactics);
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (!loading && user) {
            // Fetch coupleId
            getDoc(doc(db, "users", user.uid)).then(snap => {
                if (snap.exists() && snap.data().coupleId) {
                    setCoupleId(snap.data().coupleId);
                } else {
                    router.push("/setup");
                }
            });
        }
    }, [user, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coupleId) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "goals"), {
                coupleId,
                title,
                category,
                type: goalType,
                tactics: tactics.filter(t => t.trim() !== ""),
                cardColor,
                targetDate: targetDate || null,
                active: true,
                createdBy: user.uid,
                createdAt: serverTimestamp()
            });
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Error al crear la meta. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold hover:underline">
                    <ArrowLeft className="w-5 h-5" />
                    VOLVER
                </Link>

                <Card>
                    <h1 className="text-2xl font-black uppercase mb-6">Nueva Meta Compartida</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Título de la Meta"
                            placeholder="Ej: Cita semanal, Ahorrar para viaje..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="font-bold text-sm uppercase tracking-wide">Categoría</label>
                            <select
                                className="w-full px-4 py-2 bg-white border-2 border-black outline-none focus:shadow-[4px_4px_0px_0px_#000] cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="font-bold text-sm uppercase tracking-wide">Tipo de Meta</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGoalType("rating")}
                                    className={`py-2 px-4 border-2 border-black font-bold transition-all ${goalType === "rating" ? "bg-primary shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]" : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    EVALUADA (1-5)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGoalType("ongoing")}
                                    className={`py-2 px-4 border-2 border-black font-bold transition-all ${goalType === "ongoing" ? "bg-accent text-white shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]" : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    EN CURSO (Status)
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {goalType === "rating"
                                    ? "Califiquen cada semana del 1 al 5."
                                    : "Sin calificación. Solo registren si hubo avance."}
                            </p>
                        </div>

                        {/* Tactics Input */}
                        <div className="flex flex-col gap-2 w-full">
                            <label className="font-bold text-sm uppercase tracking-wide">Tácticas (Opcional)</label>
                            <p className="text-xs text-gray-500 mb-2">Acciones concretas para lograr esta meta (Ej: &quot;Ir al gimnasio 3 veces&quot;).</p>

                            {tactics.map((tactic, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={tactic}
                                        onChange={(e) => updateTactic(index, e.target.value)}
                                        placeholder={`Táctica ${index + 1}`}
                                        className="flex-1"
                                    />
                                    {tactics.length > 1 && (
                                        <Button type="button" variant="outline" onClick={() => removeTactic(index)} className="px-3 border-red-500 text-red-500 hover:bg-red-50">
                                            X
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="button" variant="ghost" onClick={addTactic} className="text-sm font-bold w-fit self-start">
                                + AGREGAR TÁCTICA
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-sm uppercase tracking-wide">Color de la Meta</label>
                            <div className="grid grid-cols-3 gap-2">
                                {CARD_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setCardColor(color.value)}
                                        className={`p-3 border-2 border-black font-bold text-xs transition-all ${cardColor === color.value
                                                ? "shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                                : "hover:shadow-[2px_2px_0px_0px_#000]"
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Fecha Objetivo (Opcional)"
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                        />

                        <Button type="submit" className="w-full mt-4" size="lg" isLoading={isSubmitting}>
                            CREAR META
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
