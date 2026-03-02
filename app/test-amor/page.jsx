"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createLoveTest, getLatestLoveTest } from "@/services/loveTestService";
import { DIMENSIONS } from "@/lib/loveTestQuestions";
import { ArrowLeft, HeartPulse, Clock, CheckCircle, Play } from "lucide-react";
import Link from "next/link";

export default function TestAmorPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [coupleId, setCoupleId] = useState(null);
    const [latestTest, setLatestTest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }
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
            setCoupleId(userData.coupleId);

            const test = await getLatestLoveTest(userData.coupleId);
            setLatestTest(test);
        } catch (err) {
            console.error("Error fetching test data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartTest = async () => {
        setIsCreating(true);
        try {
            const testId = await createLoveTest(coupleId, user.uid);
            router.push(`/test-amor/take?id=${testId}`);
        } catch (err) {
            console.error("Error creating test:", err);
            alert("Error al crear el test");
        } finally {
            setIsCreating(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    const myResponse = latestTest?.responses?.[user.uid];
    const partnerResponded = latestTest && Object.keys(latestTest.responses || {}).some(uid => uid !== user.uid);
    const testComplete = latestTest?.status === "complete";
    const testPending = latestTest?.status === "pending";
    const iHaveResponded = !!myResponse;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <Link href="/dashboard">
                        <Button size="sm" variant="ghost" className="px-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <HeartPulse className="w-6 h-6 text-danger" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">Test del Amor</h1>
                    </div>
                    <div className="w-9" />
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Intro */}
                <Card className="bg-pink-100">
                    <div className="text-center space-y-3">
                        <HeartPulse className="w-12 h-12 mx-auto text-danger" />
                        <h2 className="font-black text-2xl uppercase">Test del Amor</h2>
                        <p className="text-sm font-medium text-gray-700">
                            Un test basado en investigación psicológica para evaluar 6 dimensiones
                            clave de tu relación. Ambos contestan por separado y luego comparan resultados.
                        </p>
                    </div>
                </Card>

                {/* Dimensions preview */}
                <div>
                    <h3 className="font-bold text-sm uppercase mb-3">6 Dimensiones Evaluadas</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {DIMENSIONS.map(dim => (
                            <div key={dim.id} className={`p-3 border-2 border-black ${dim.color}`}>
                                <p className="font-bold text-xs uppercase">{dim.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status / Actions */}
                {testComplete && (
                    <Card className="bg-green-100">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="font-bold text-green-800">Test Completado</span>
                        </div>
                        <p className="text-sm mb-4">Ambos han completado el test. Revisa los resultados.</p>
                        <Link href={`/test-amor/results?id=${latestTest.id}`}>
                            <Button className="w-full">VER RESULTADOS</Button>
                        </Link>
                        <div className="mt-3">
                            <Button variant="outline" className="w-full" onClick={handleStartTest} isLoading={isCreating}>
                                NUEVO TEST
                            </Button>
                        </div>
                    </Card>
                )}

                {testPending && iHaveResponded && !partnerResponded && (
                    <Card className="bg-yellow-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-6 h-6 text-yellow-600" />
                            <span className="font-bold text-yellow-800">Esperando a tu pareja...</span>
                        </div>
                        <p className="text-sm">Ya completaste tu parte. Tu pareja necesita responder para ver los resultados.</p>
                    </Card>
                )}

                {testPending && !iHaveResponded && (
                    <Card className="bg-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Play className="w-6 h-6 text-blue-600" />
                            <span className="font-bold text-blue-800">Tu pareja inició un test</span>
                        </div>
                        <p className="text-sm mb-4">Completa tu parte para ver los resultados juntos.</p>
                        <Link href={`/test-amor/take?id=${latestTest.id}`}>
                            <Button className="w-full">COMPLETAR TEST</Button>
                        </Link>
                    </Card>
                )}

                {!latestTest && (
                    <Button className="w-full" size="lg" onClick={handleStartTest} isLoading={isCreating}>
                        INICIAR TEST
                    </Button>
                )}

                {/* Info */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                    <p className="font-bold">25 preguntas | ~5 minutos</p>
                    <p>Basado en: ECR-R, Trust Scale, CPQ, SIS, DSI</p>
                    <p>Tus respuestas son privadas hasta que ambos completen el test.</p>
                </div>
            </main>
        </div>
    );
}
