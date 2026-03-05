"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LikertScale } from "@/components/test-amor/LikertScale";
import { ScenarioQuestion } from "@/components/test-amor/ScenarioQuestion";
import { QUESTIONS, DIMENSIONS, SCENARIOS, SCENARIO_PATTERNS } from "@/lib/loveTestQuestions";
import { getLoveTest, submitTestResponse } from "@/services/loveTestService";
import { ArrowLeft, ArrowRight, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TakeTestPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        }>
            <TakeTestContent />
        </Suspense>
    );
}

// Phases: "likert" → "transition" → "scenarios"
function TakeTestContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");

    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likertAnswers, setLikertAnswers] = useState({});
    const [scenarioAnswers, setScenarioAnswers] = useState({});
    const [phase, setPhase] = useState("likert"); // "likert" | "transition" | "scenarios"
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Likert groups ---
    const likertGroups = DIMENSIONS.map(dim => ({
        dimension: dim,
        questions: QUESTIONS.filter(q => q.construct === dim.id),
    }));

    // --- Scenario groups ---
    const scenarioGroups = SCENARIO_PATTERNS.map(pattern => ({
        pattern,
        scenarios: SCENARIOS.filter(s => s.pattern === pattern.id),
    }));

    const totalQuestions = QUESTIONS.length + SCENARIOS.length; // 45
    const likertAnsweredCount = Object.keys(likertAnswers).length;
    const scenarioAnsweredCount = Object.keys(scenarioAnswers).length;
    const totalAnswered = likertAnsweredCount + scenarioAnsweredCount;

    // Current group based on phase
    const currentGroups = phase === "likert" ? likertGroups : scenarioGroups;
    const currentGroup = currentGroups[currentGroupIndex];
    const isLastGroup = currentGroupIndex === currentGroups.length - 1;

    // Check if all questions in current group are answered
    const currentGroupComplete = phase === "likert"
        ? currentGroup?.questions.every(q => likertAnswers[q.id] != null)
        : currentGroup?.scenarios.every(s => scenarioAnswers[s.id] != null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }
        if (!loading && user && testId) fetchTest();
    }, [user, loading, testId]);

    const fetchTest = async () => {
        try {
            const testData = await getLoveTest(testId);
            if (!testData) {
                alert("Test no encontrado");
                router.push("/test-amor");
                return;
            }
            if (testData.responses?.[user.uid]) {
                router.push("/test-amor");
                return;
            }
            setTest(testData);
        } catch (err) {
            console.error("Error fetching test:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLikertAnswer = (questionId, value) => {
        setLikertAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleScenarioAnswer = (scenarioId, style) => {
        setScenarioAnswers(prev => ({ ...prev, [scenarioId]: style }));
    };

    const handleNext = () => {
        if (isLastGroup) {
            if (phase === "likert") {
                setPhase("transition");
            }
        } else {
            setCurrentGroupIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleStartScenarios = () => {
        setPhase("scenarios");
        setCurrentGroupIndex(0);
        window.scrollTo(0, 0);
    };

    const handlePrev = () => {
        if (currentGroupIndex > 0) {
            setCurrentGroupIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        } else if (phase === "scenarios") {
            setPhase("transition");
        }
    };

    const handleSubmit = async () => {
        const unansweredLikert = QUESTIONS.filter(q => likertAnswers[q.id] == null);
        const unansweredScenarios = SCENARIOS.filter(s => scenarioAnswers[s.id] == null);
        const total = unansweredLikert.length + unansweredScenarios.length;
        if (total > 0) {
            alert(`Faltan ${total} preguntas por responder.`);
            return;
        }

        setIsSubmitting(true);
        try {
            await submitTestResponse(testId, user.uid, likertAnswers, scenarioAnswers);
            router.push(`/test-amor/results?id=${testId}&tab=personal`);
        } catch (err) {
            console.error("Error submitting:", err);
            alert("Error al enviar respuestas");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!testId) {
        router.push("/test-amor");
        return null;
    }

    const progressPercent = Math.round((totalAnswered / totalQuestions) * 100);

    // --- Transition screen ---
    if (phase === "transition") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="bg-pink-100 max-w-md text-center space-y-4">
                    <Sparkles className="w-12 h-12 mx-auto text-pink-500" />
                    <h2 className="font-black text-2xl uppercase">¡Excelente!</h2>
                    <p className="text-sm font-medium text-gray-700">
                        Ahora vamos con situaciones reales. Lee cada escenario y elige la opción
                        que más se parezca a cómo reaccionarías tú.
                    </p>
                    <p className="text-xs text-gray-500">
                        No hay respuestas correctas o incorrectas — solo queremos conocer tu estilo.
                    </p>
                    <Button className="w-full" onClick={handleStartScenarios}>
                        CONTINUAR
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Card>
            </div>
        );
    }

    // --- Calculate question number offset ---
    let questionOffset = phase === "likert" ? 0 : QUESTIONS.length;
    for (let i = 0; i < currentGroupIndex; i++) {
        if (phase === "likert") {
            questionOffset += likertGroups[i].questions.length;
        } else {
            questionOffset += scenarioGroups[i].scenarios.length;
        }
    }

    // Group header info
    const groupLabel = phase === "likert" ? currentGroup.dimension : currentGroup.pattern;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={() => router.push("/test-amor")} className="text-sm font-bold underline">
                            Salir
                        </button>
                        <span className="text-sm font-bold">{totalAnswered}/{totalQuestions}</span>
                    </div>
                    <div className="h-3 bg-white border-2 border-black">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Group header */}
                <div className={cn(
                    "p-3 border-2 border-black shadow-[4px_4px_0px_0px_#000]",
                    groupLabel.color
                )}>
                    <div className="flex justify-between items-center">
                        <h2 className="font-black text-lg uppercase">{groupLabel.name}</h2>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-1">
                            {currentGroupIndex + 1}/{currentGroups.length}
                        </span>
                    </div>
                    <p className="text-xs mt-1">{groupLabel.description}</p>
                    {phase === "scenarios" && (
                        <span className="inline-block mt-2 text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
                            Escenarios
                        </span>
                    )}
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {phase === "likert" && currentGroup.questions.map((q, idx) => (
                        <Card key={q.id} className="p-4">
                            <LikertScale
                                question={q}
                                value={likertAnswers[q.id]}
                                onChange={(val) => handleLikertAnswer(q.id, val)}
                                questionNumber={questionOffset + idx + 1}
                                total={totalQuestions}
                            />
                        </Card>
                    ))}

                    {phase === "scenarios" && currentGroup.scenarios.map((s, idx) => (
                        <Card key={s.id} className="p-4">
                            <ScenarioQuestion
                                scenario={s}
                                value={scenarioAnswers[s.id]}
                                onChange={(style) => handleScenarioAnswer(s.id, style)}
                                questionNumber={questionOffset + idx + 1}
                                total={totalQuestions}
                            />
                        </Card>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    {(currentGroupIndex > 0 || phase === "scenarios") && (
                        <Button variant="outline" className="flex-1" onClick={handlePrev}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>
                    )}

                    {!(phase === "scenarios" && isLastGroup) ? (
                        <Button
                            className="flex-1"
                            onClick={handleNext}
                            disabled={!currentGroupComplete}
                        >
                            Siguiente
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={totalAnswered < totalQuestions}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            ENVIAR
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
