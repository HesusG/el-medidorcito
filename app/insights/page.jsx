"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getCoupleGoalsWithScores } from "@/services/data";
import { GapChart } from "@/components/charts/GapChart";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InsightsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [topGapGoals, setTopGapGoals] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) router.push("/login");
        if (!loading && user) fetchData();
    }, [user, loading]);

    const fetchData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();

            if (!userData?.coupleId) {
                router.push("/setup");
                return;
            }

            const goals = await getCoupleGoalsWithScores(userData.coupleId, user.uid);

            // Sort by gap desc
            const sorted = goals.sort((a, b) => b.gap - a.gap).slice(0, 5);
            setTopGapGoals(sorted);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading || isLoadingData) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold hover:underline">
                    <ArrowLeft className="w-5 h-5" />
                    VOLVER AL DASHBOARD
                </Link>

                <div>
                    <h1 className="text-2xl font-black uppercase mb-2">Insights</h1>
                    <p className="text-gray-600">Donde más difieren (Top 5 Brechas)</p>
                </div>

                {topGapGoals.length > 0 ? (
                    <div className="space-y-4">
                        <GapChart data={topGapGoals} />

                        <div className="bg-white border-2 border-black p-4">
                            <h3 className="font-bold border-b-2 border-black/10 pb-2 mb-2">DETALLE DE BRECHAS</h3>
                            {topGapGoals.map(g => (
                                <div key={g.id} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
                                    <span className="font-medium text-sm truncate pr-4">{g.title}</span>
                                    <span className="font-black bg-yellow-200 border border-black px-2 text-sm">Gap: {g.gap}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No hay suficientes datos para mostrar insights.
                    </div>
                )}
            </div>
        </div>
    );
}
