"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RadarComparisonChart } from "@/components/charts/RadarComparisonChart";
import { DimensionCard } from "@/components/test-amor/DimensionCard";
import { DIMENSIONS } from "@/lib/loveTestQuestions";
import { compareScores, getSummary } from "@/lib/loveTestScoring";
import { getLoveTest } from "@/services/loveTestService";
import { ArrowLeft, HeartPulse, Star, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");

    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myName, setMyName] = useState("Yo");
    const [partnerName, setPartnerName] = useState("Pareja");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }
        if (!loading && user && testId) fetchData();
    }, [user, loading, testId]);

    const fetchData = async () => {
        try {
            const testData = await getLoveTest(testId);
            if (!testData || testData.status !== "complete") {
                router.push("/test-amor");
                return;
            }
            setTest(testData);

            // Get names
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            if (userData?.displayName) setMyName(userData.displayName);

            if (userData?.coupleId) {
                const usersQ = query(
                    collection(db, "users"),
                    where("coupleId", "==", userData.coupleId)
                );
                const partnerSnap = await getDocs(usersQ);
                const partnerDoc = partnerSnap.docs.find(d => d.id !== user.uid);
                if (partnerDoc?.data()?.displayName) {
                    setPartnerName(partnerDoc.data().displayName);
                }
            }
        } catch (err) {
            console.error("Error fetching results:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!test || test.status !== "complete") return null;

    // Extract scores
    const respondents = Object.keys(test.responses);
    const myUid = user.uid;
    const partnerUid = respondents.find(uid => uid !== myUid);

    const myScores = test.responses[myUid]?.dimensionScores || {};
    const partnerScores = test.responses[partnerUid]?.dimensionScores || {};

    // Compare
    const comparison = compareScores(myScores, partnerScores);
    const { fortalezas, oportunidades } = getSummary(comparison);

    // Radar chart data
    const radarData = DIMENSIONS.map(dim => ({
        dimension: dim.name,
        scoreA: myScores[dim.id] || 0,
        scoreB: partnerScores[dim.id] || 0,
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <Link href="/test-amor">
                        <Button size="sm" variant="ghost" className="px-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-danger" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">Resultados</h1>
                    </div>
                    <div className="w-9" />
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Title */}
                <Card className="bg-pink-100 text-center">
                    <h2 className="font-black text-xl uppercase mb-1">Test del Amor</h2>
                    <p className="text-sm font-medium text-gray-600">
                        {myName} vs {partnerName}
                    </p>
                </Card>

                {/* Radar Chart */}
                <div>
                    <h3 className="font-bold text-sm uppercase mb-3">Comparación General</h3>
                    <RadarComparisonChart
                        data={radarData}
                        nameA={myName}
                        nameB={partnerName}
                    />
                </div>

                {/* Fortalezas */}
                {fortalezas.length > 0 && (
                    <Card className="bg-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-green-700" />
                            <h3 className="font-black text-base uppercase text-green-800">Fortalezas</h3>
                        </div>
                        <p className="text-sm text-green-700 mb-2">
                            Áreas donde están alineados como pareja.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {fortalezas.map(f => (
                                <span key={f} className="px-3 py-1 bg-green-200 border-2 border-black text-xs font-bold">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Oportunidades */}
                {oportunidades.length > 0 && (
                    <Card className="bg-red-100">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-700" />
                            <h3 className="font-black text-base uppercase text-red-800">Áreas de Oportunidad</h3>
                        </div>
                        <p className="text-sm text-red-700 mb-2">
                            Dimensiones donde sus percepciones difieren significativamente.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {oportunidades.map(o => (
                                <span key={o} className="px-3 py-1 bg-red-200 border-2 border-black text-xs font-bold">
                                    {o}
                                </span>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Dimension Cards */}
                <div>
                    <h3 className="font-bold text-sm uppercase mb-3">Detalle por Dimensión</h3>
                    <div className="space-y-4">
                        {comparison.map(c => {
                            const dim = DIMENSIONS.find(d => d.id === c.dimension);
                            return (
                                <DimensionCard
                                    key={c.dimension}
                                    dimension={dim}
                                    scoreA={c.scoreA}
                                    scoreB={c.scoreB}
                                    gap={c.gap}
                                    gapLevel={c.gapLevel}
                                    myName={myName}
                                    partnerName={partnerName}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Back */}
                <div className="pb-6">
                    <Link href="/test-amor">
                        <Button variant="outline" className="w-full">
                            VOLVER AL TEST
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
