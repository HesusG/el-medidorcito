import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getWeekKey } from "@/lib/utils";

export function CheckinForm({ goalId, userId, goalType = "rating", tactics = [], onCheckinComplete }) {
    const [score, setScore] = useState(5);
    const [note, setNote] = useState("");
    const [tacticResults, setTacticResults] = useState({}); // { 0: true, 1: false }
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentWeek = getWeekKey();

    const handleScoreClick = (val) => setScore(val);
    const handleTacticToggle = (idx, val) => {
        setTacticResults(prev => ({
            ...prev,
            [idx]: prev[idx] === val ? null : val // Toggle off if clicked again
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const checkinId = `${userId}_${currentWeek}`;
            const payload = {
                uid: userId,
                weekKey: currentWeek,
                note,
                tacticResults,
                updatedAt: serverTimestamp()
            };

            if (goalType === "rating") {
                payload.score = score;
            }

            await setDoc(doc(db, "goals", goalId, "checkins", checkinId), payload);
            setNote("");
            if (onCheckinComplete) onCheckinComplete();
        } catch (err) {
            console.error(err);
            alert("Error al guardar check-in");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-bold text-lg border-b-2 border-black/10 pb-2">CHECK-IN SEMANAL ({currentWeek})</h3>

            {goalType === "rating" ? (
                <div>
                    <label className="text-sm font-bold uppercase block mb-2">Puntuación: {score}/5</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => handleScoreClick(val)}
                                className={`flex-1 aspect-square font-black text-lg border-2 border-black transition-all
                    ${score === val
                                        ? "bg-primary shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                        : "bg-white hover:bg-gray-50"
                                    }
                  `}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border-2 border-accent p-2 text-sm font-medium text-accent">
                    Meta de Seguimiento: Registra tu avance o estado actual en la nota.
                </div>
            )}

            {/* Tactics Feedback */}
            {tactics && tactics.length > 0 && (
                <div>
                    <label className="text-sm font-bold uppercase block mb-2">Tácticas (¿Funcionaron?)</label>
                    <div className="space-y-2">
                        {tactics.map((tactic, idx) => (
                            <div key={idx} className="flex items-center justify-between border-2 border-black/10 p-2 bg-gray-50">
                                <span className="text-sm font-medium pr-2 max-w-[70%]">{tactic}</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTacticToggle(idx, true)}
                                        className={`p-1 border-2 border-black rounded-md transition-all ${tacticResults[idx] === true ? "bg-green-200 shadow-[2px_2px_0px_0px_#000]" : "bg-white hover:bg-gray-100 opacity-50"}`}
                                    >
                                        👍
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTacticToggle(idx, false)}
                                        className={`p-1 border-2 border-black rounded-md transition-all ${tacticResults[idx] === false ? "bg-red-200 shadow-[2px_2px_0px_0px_#000]" : "bg-white hover:bg-gray-100 opacity-50"}`}
                                    >
                                        👎
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="text-sm font-bold uppercase block mb-2">
                    {goalType === "rating" ? "Nota (Opcional)" : "Estado / Avance"}
                </label>
                <textarea
                    className="w-full border-2 border-black p-2 min-h-[80px] outline-none focus:shadow-[4px_4px_0px_0px_#000]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={goalType === "rating" ? "¿Por qué esta calificación?" : "Ej: Leí 2 capítulos, Ahorramos $50..."}
                    required={goalType !== "rating"}
                />
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                GUARDAR CHECK-IN
            </Button>
        </form>
    );
}
