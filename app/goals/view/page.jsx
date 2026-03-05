"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, collection, query, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { ScoreChart } from "@/components/charts/ScoreChart";
import { CheckinForm } from "@/components/goals/CheckinForm";
import { CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function GoalDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        }>
            <GoalDetailContent />
        </Suspense>
    );
}

function GoalDetailContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [goal, setGoal] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
        if (!loading && user && id) fetchData();
    }, [user, loading, id]);

    const fetchData = async () => {
        try {
            const goalSnap = await getDoc(doc(db, "goals", id));
            if (!goalSnap.exists()) {
                alert("Meta no encontrada");
                router.push("/dashboard");
                return;
            }
            setGoal({ id: goalSnap.id, ...goalSnap.data() });

            const q = query(collection(db, "goals", id, "checkins"), orderBy("weekKey", "asc"));
            const snap = await getDocs(q);
            const docs = snap.docs.map(d => d.data());

            const grouped = {};
            docs.forEach(d => {
                if (!grouped[d.weekKey]) grouped[d.weekKey] = { week: d.weekKey };
                if (d.uid === user.uid) grouped[d.weekKey].me = d.score;
                else grouped[d.weekKey].partner = d.score;
            });
            const chartData = Object.values(grouped).sort((a, b) => a.week.localeCompare(b.week));
            setHistory(chartData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta meta? Esta acción no se puede deshacer.")) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "goals", id));
            router.push("/dashboard");
        } catch (err) {
            console.error("Error deleting goal:", err);
            alert("Error al eliminar la meta. Intenta de nuevo.");
            setIsDeleting(false);
        }
    };

    if (loading || isLoadingData || !goal) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-20">
            <div className="max-w-md mx-auto space-y-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold hover:underline">
                    <ArrowLeft className="w-5 h-5" />
                    VOLVER AL DASHBOARD
                </Link>

                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                    <div className="flex justify-between items-start mb-2">
                        <span className={cn("inline-block px-2 py-0.5 text-xs font-bold border border-black", CATEGORY_COLORS[goal.category])}>
                            {goal.category}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <h1 className="text-2xl font-black uppercase leading-tight">{goal.title}</h1>
                    {goal.targetDate && <p className="text-sm text-gray-500 font-bold mt-1">META: {goal.targetDate}</p>}
                </div>

                <CheckinForm
                    goalId={id}
                    userId={user.uid}
                    goalType={goal.type || "rating"}
                    tactics={goal.tactics || []}
                    onCheckinComplete={fetchData}
                />

                {(!goal.type || goal.type === "rating") && (
                    <div>
                        <h3 className="font-black text-lg mb-2 uppercase">Historial</h3>
                        <ScoreChart data={history} />
                    </div>
                )}

                <div className="bg-white border-2 border-black p-4">
                    <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-2">ÚLTIMOS REGISTROS</h3>
                    <div className="space-y-3">
                        {[...history].reverse().slice(0, 5).map((weekItem, i) => (
                            goal.type === "ongoing" ? (
                                <div key={i} className="text-sm border-b border-gray-100 last:border-0 pb-2">
                                    <span className="font-mono font-bold block">{weekItem.week}</span>
                                    <div className="text-gray-600 italic">&quot;Registrado&quot;</div>
                                </div>
                            ) : (
                                <div key={weekItem.week} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-2">
                                    <span className="font-mono font-bold">{weekItem.week}</span>
                                    <div className="flex gap-4">
                                        <span className="font-bold text-black">YO: {weekItem.me || "-"}</span>
                                        <span className="font-bold text-red-500">PAREJA: {weekItem.partner || "-"}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
