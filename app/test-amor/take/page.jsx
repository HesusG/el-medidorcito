"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LikertScale } from "@/components/test-amor/LikertScale";
import { QUESTIONS, DIMENSIONS } from "@/lib/loveTestQuestions";
import { getLoveTest, submitTestResponse } from "@/services/loveTestService";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
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

function TakeTestContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get("id");

    const [test, setTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [currentDimIndex, setCurrentDimIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Group questions by dimension
    const questionsByDim = DIMENSIONS.map(dim => ({
        dimension: dim,
        questions: QUESTIONS.filter(q => q.construct === dim.id),
    }));

    const currentGroup = questionsByDim[currentDimIndex];
    const totalQuestions = QUESTIONS.length;
    const answeredCount = Object.keys(answers).length;
    const isLastDimension = currentDimIndex === questionsByDim.length - 1;

    // Check if all questions in current dimension are answered
    const currentDimComplete = currentGroup.questions.every(q => answers[q.id] != null);

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
            // If user already responded, redirect
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

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentDimIndex < questionsByDim.length - 1) {
            setCurrentDimIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        if (currentDimIndex > 0) {
            setCurrentDimIndex(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        // Verify all answered
        const unanswered = QUESTIONS.filter(q => answers[q.id] == null);
        if (unanswered.length > 0) {
            alert(`Faltan ${unanswered.length} preguntas por responder.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const { status } = await submitTestResponse(testId, user.uid, answers);
            if (status === "complete") {
                router.push(`/test-amor/results?id=${testId}`);
            } else {
                router.push("/test-amor");
            }
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

    // Global progress
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    // Calculate the question number offset for current dimension
    let questionOffset = 0;
    for (let i = 0; i < currentDimIndex; i++) {
        questionOffset += questionsByDim[i].questions.length;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <button onClick={() => router.push("/test-amor")} className="text-sm font-bold underline">
                            Salir
                        </button>
                        <span className="text-sm font-bold">{answeredCount}/{totalQuestions}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-3 bg-white border-2 border-black">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Dimension header */}
                <div className={cn(
                    "p-3 border-2 border-black shadow-[4px_4px_0px_0px_#000]",
                    currentGroup.dimension.color
                )}>
                    <div className="flex justify-between items-center">
                        <h2 className="font-black text-lg uppercase">{currentGroup.dimension.name}</h2>
                        <span className="text-xs font-bold bg-white border-2 border-black px-2 py-1">
                            {currentDimIndex + 1}/{questionsByDim.length}
                        </span>
                    </div>
                    <p className="text-xs mt-1">{currentGroup.dimension.description}</p>
                </div>

                {/* Questions for current dimension */}
                <div className="space-y-6">
                    {currentGroup.questions.map((q, idx) => (
                        <Card key={q.id} className="p-4">
                            <LikertScale
                                question={q}
                                value={answers[q.id]}
                                onChange={(val) => handleAnswer(q.id, val)}
                                questionNumber={questionOffset + idx + 1}
                                total={totalQuestions}
                            />
                        </Card>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    {currentDimIndex > 0 && (
                        <Button variant="outline" className="flex-1" onClick={handlePrev}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Anterior
                        </Button>
                    )}

                    {!isLastDimension ? (
                        <Button
                            className="flex-1"
                            onClick={handleNext}
                            disabled={!currentDimComplete}
                        >
                            Siguiente
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="flex-1"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={answeredCount < totalQuestions}
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
