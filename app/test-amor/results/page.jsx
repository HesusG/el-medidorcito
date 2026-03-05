"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RadarComparisonChart } from "@/components/charts/RadarComparisonChart";
import { DimensionCard } from "@/components/test-amor/DimensionCard";
import { PatternCard } from "@/components/test-amor/PatternCard";
import { StyleProfileCard } from "@/components/test-amor/StyleProfileCard";
import { IntrospectionCard } from "@/components/test-amor/IntrospectionCard";
import { FeedbackSection } from "@/components/test-amor/FeedbackSection";
import { ResultsTabs } from "@/components/test-amor/ResultsTabs";
import { DIMENSIONS, SCENARIO_PATTERNS } from "@/lib/loveTestQuestions";
import {
    compareScores,
    getSummary,
    comparePatternScores,
    normalizePatternScore,
    getCoupleStyleDynamic,
} from "@/lib/loveTestScoring";
import { DIMENSION_FEEDBACK, PATTERN_FEEDBACK } from "@/lib/loveTestFeedback";
import { getLoveTest } from "@/services/loveTestService";
import { ArrowLeft, HeartPulse, Star, AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}

function getFeedbackLevel(score, type) {
    if (type === "dimension") {
        if (score >= 4.0) return "high";
        if (score >= 2.5) return "medium";
        return "low";
    }
    // pattern (1-4 scale)
    if (score >= 3.5) return "high";
    if (score >= 2.0) return "medium";
    return "low";
}

function ResultsContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");
    const initialTab = searchParams.get("tab") || "personal";

    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myName, setMyName] = useState("Yo");
    const [partnerName, setPartnerName] = useState("Pareja");
    const [activeTab, setActiveTab] = useState(initialTab);

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
            if (!testData) {
                router.push("/test-amor");
                return;
            }
            // Must have my response to view results
            if (!testData.responses?.[user.uid]) {
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

    if (!test) return null;

    const myUid = user.uid;
    const myResponse = test.responses[myUid];
    const respondents = Object.keys(test.responses);
    const partnerUid = respondents.find(uid => uid !== myUid);
    const partnerResponse = partnerUid ? test.responses[partnerUid] : null;
    const coupleReady = test.status === "complete" && !!partnerResponse;

    // My data
    const myDimensionScores = myResponse?.dimensionScores || {};
    const myPatternScores = myResponse?.patternScores || {};
    const myDominantStyle = myResponse?.dominantStyle || "secure";
    const myStyleBreakdown = myResponse?.styleBreakdown || {};

    // Partner data (if available)
    const partnerDimensionScores = partnerResponse?.dimensionScores || {};
    const partnerPatternScores = partnerResponse?.patternScores || {};
    const partnerDominantStyle = partnerResponse?.dominantStyle;
    const partnerStyleBreakdown = partnerResponse?.styleBreakdown || {};

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
                {/* Tabs */}
                <ResultsTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    coupleReady={coupleReady}
                />

                {activeTab === "personal" && (
                    <PersonalView
                        myName={myName}
                        myDimensionScores={myDimensionScores}
                        myPatternScores={myPatternScores}
                        myDominantStyle={myDominantStyle}
                        myStyleBreakdown={myStyleBreakdown}
                        coupleReady={coupleReady}
                    />
                )}

                {activeTab === "couple" && coupleReady && (
                    <CoupleView
                        myName={myName}
                        partnerName={partnerName}
                        myDimensionScores={myDimensionScores}
                        partnerDimensionScores={partnerDimensionScores}
                        myPatternScores={myPatternScores}
                        partnerPatternScores={partnerPatternScores}
                        myDominantStyle={myDominantStyle}
                        partnerDominantStyle={partnerDominantStyle}
                        myStyleBreakdown={myStyleBreakdown}
                        partnerStyleBreakdown={partnerStyleBreakdown}
                    />
                )}

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

// --- Personal View ---
function PersonalView({ myName, myDimensionScores, myPatternScores, myDominantStyle, myStyleBreakdown, coupleReady }) {
    // Radar data — dimensions
    const radarDimData = DIMENSIONS.map(dim => ({
        dimension: dim.name,
        scoreA: myDimensionScores[dim.id] || 0,
    }));

    // Radar data — patterns (normalized to 1-5 for chart)
    const radarPatternData = SCENARIO_PATTERNS.map(p => ({
        dimension: p.name,
        scoreA: normalizePatternScore(myPatternScores[p.id] || 0),
    }));

    return (
        <>
            {/* Style Profile */}
            <StyleProfileCard
                dominantStyle={myDominantStyle}
                styleBreakdown={myStyleBreakdown}
                label="Tu Estilo de Respuesta"
            />

            {/* Dimension scores */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Tus Dimensiones</h3>
                <RadarComparisonChart
                    data={radarDimData}
                    nameA={myName}
                    singleMode
                />
                <div className="space-y-4 mt-4">
                    {DIMENSIONS.map(dim => {
                        const score = myDimensionScores[dim.id] || 0;
                        const level = getFeedbackLevel(score, "dimension");
                        const feedback = DIMENSION_FEEDBACK[dim.id]?.[level];
                        return (
                            <DimensionCard
                                key={dim.id}
                                dimension={dim}
                                scoreA={score}
                                mode="personal"
                                myName={myName}
                                feedback={feedback}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Pattern scores */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Tus Patrones de Reacción</h3>
                <RadarComparisonChart
                    data={radarPatternData}
                    nameA={myName}
                    singleMode
                />
                <div className="space-y-4 mt-4">
                    {SCENARIO_PATTERNS.map(pattern => {
                        const score = myPatternScores[pattern.id] || 0;
                        const level = getFeedbackLevel(score, "pattern");
                        const feedback = PATTERN_FEEDBACK[pattern.id]?.[level];
                        return (
                            <PatternCard
                                key={pattern.id}
                                pattern={pattern}
                                scoreA={score}
                                mode="personal"
                                myName={myName}
                                feedback={feedback}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Introspection */}
            <IntrospectionCard patternScores={myPatternScores} />

            {/* CTA if couple not ready */}
            {!coupleReady && (
                <Card className="bg-yellow-100">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800 text-sm">Esperando a tu pareja</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                        Cuando tu pareja complete el test, podrán ver la Vista de Pareja con comparaciones y feedback juntos.
                    </p>
                </Card>
            )}
        </>
    );
}

// --- Couple View ---
function CoupleView({
    myName,
    partnerName,
    myDimensionScores,
    partnerDimensionScores,
    myPatternScores,
    partnerPatternScores,
    myDominantStyle,
    partnerDominantStyle,
    myStyleBreakdown,
    partnerStyleBreakdown,
}) {
    const dimComparison = compareScores(myDimensionScores, partnerDimensionScores);
    const patternComparison = comparePatternScores(myPatternScores, partnerPatternScores);
    const { fortalezas, oportunidades } = getSummary(dimComparison);
    const coupleDynamic = getCoupleStyleDynamic(myDominantStyle, partnerDominantStyle);

    // Radar data
    const radarDimData = DIMENSIONS.map(dim => ({
        dimension: dim.name,
        scoreA: myDimensionScores[dim.id] || 0,
        scoreB: partnerDimensionScores[dim.id] || 0,
    }));

    const radarPatternData = SCENARIO_PATTERNS.map(p => ({
        dimension: p.name,
        scoreA: normalizePatternScore(myPatternScores[p.id] || 0),
        scoreB: normalizePatternScore(partnerPatternScores[p.id] || 0),
    }));

    return (
        <>
            {/* Title */}
            <Card className="bg-pink-100 text-center">
                <h2 className="font-black text-xl uppercase mb-1">Test del Amor</h2>
                <p className="text-sm font-medium text-gray-600">
                    {myName} vs {partnerName}
                </p>
            </Card>

            {/* Couple Style Dynamic */}
            <Card className="bg-indigo-100">
                <h3 className="font-black text-base uppercase mb-2">Dinámica de Pareja</h3>
                <div className="flex justify-between text-sm font-bold mb-3">
                    <span>{myName}: <span className="uppercase">{myDominantStyle}</span></span>
                    <span>{partnerName}: <span className="uppercase">{partnerDominantStyle}</span></span>
                </div>
                <div className="bg-white border-2 border-black p-3">
                    <p className="font-bold text-sm mb-1">{coupleDynamic.title}</p>
                    <p className="text-sm text-gray-700">{coupleDynamic.message}</p>
                </div>
            </Card>

            {/* Dimension Radar */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Comparación — Dimensiones</h3>
                <RadarComparisonChart
                    data={radarDimData}
                    nameA={myName}
                    nameB={partnerName}
                />
            </div>

            {/* Fortalezas & Oportunidades */}
            {fortalezas.length > 0 && (
                <Card className="bg-green-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-green-700" />
                        <h3 className="font-black text-base uppercase text-green-800">Fortalezas</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2">Áreas donde están alineados como pareja.</p>
                    <div className="flex flex-wrap gap-2">
                        {fortalezas.map(f => (
                            <span key={f} className="px-3 py-1 bg-green-200 border-2 border-black text-xs font-bold">{f}</span>
                        ))}
                    </div>
                </Card>
            )}

            {oportunidades.length > 0 && (
                <Card className="bg-red-100">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-700" />
                        <h3 className="font-black text-base uppercase text-red-800">Áreas de Oportunidad</h3>
                    </div>
                    <p className="text-sm text-red-700 mb-2">Dimensiones donde sus percepciones difieren significativamente.</p>
                    <div className="flex flex-wrap gap-2">
                        {oportunidades.map(o => (
                            <span key={o} className="px-3 py-1 bg-red-200 border-2 border-black text-xs font-bold">{o}</span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Dimension Cards */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Detalle por Dimensión</h3>
                <div className="space-y-4">
                    {dimComparison.map(c => {
                        const dim = DIMENSIONS.find(d => d.id === c.dimension);
                        return (
                            <DimensionCard
                                key={c.dimension}
                                dimension={dim}
                                scoreA={c.scoreA}
                                scoreB={c.scoreB}
                                gap={c.gap}
                                gapLevel={c.gapLevel}
                                mode="couple"
                                myName={myName}
                                partnerName={partnerName}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Pattern Radar */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Comparación — Patrones de Reacción</h3>
                <RadarComparisonChart
                    data={radarPatternData}
                    nameA={myName}
                    nameB={partnerName}
                />
            </div>

            {/* Pattern Cards */}
            <div>
                <h3 className="font-bold text-sm uppercase mb-3">Detalle por Patrón</h3>
                <div className="space-y-4">
                    {patternComparison.map(c => {
                        const pattern = SCENARIO_PATTERNS.find(p => p.id === c.pattern);
                        return (
                            <PatternCard
                                key={c.pattern}
                                pattern={pattern}
                                scoreA={c.scoreA}
                                scoreB={c.scoreB}
                                gap={c.gap}
                                gapLevel={c.gapLevel}
                                mode="couple"
                                myName={myName}
                                partnerName={partnerName}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
