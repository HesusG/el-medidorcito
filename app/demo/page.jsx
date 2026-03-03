"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GoalCard } from "@/components/goals/GoalCard";
import { HelpModal } from "@/components/ui/HelpModal";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { Plus, BarChart2, Heart, HelpCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// MOCK DATA
const MOCK_GOALS = [
    {
        id: "demo-1",
        title: "Cita Semanal",
        category: "Conexión",
        myScore: 5,
        partnerScore: 3,
        gap: 2,
        trend: { me: "up", partner: "down" },
        type: "rating"
    },
    {
        id: "demo-2",
        title: "Ahorro Viaje a Japón",
        category: "Aventura & Diversión",
        type: "ongoing",
        active: true
    },
    {
        id: "demo-3",
        title: "Limpieza del Hogar",
        category: "Hogar & Logística",
        myScore: 4,
        partnerScore: 4,
        gap: 0,
        trend: { me: "flat", partner: "up" },
        type: "rating"
    },
    {
        id: "demo-4",
        title: "Leer Juntos",
        category: "Crecimiento",
        myScore: 2,
        partnerScore: 4,
        gap: 2,
        trend: { me: "down", partner: "up" },
        type: "rating"
    }
];

export default function DemoPage() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Group goals by category
    const groupedGoals = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = MOCK_GOALS.filter(g => g.category === cat);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-danger fill-danger animate-pulse" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">DEMO</h1>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button size="sm" variant="ghost" className="px-2 text-xs font-bold bg-gray-100">
                                SALIR
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Demo Notification */}
                <div className="bg-blue-100 border-2 border-black p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_#000]">
                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                        <p className="font-bold text-sm text-blue-800 uppercase">MODO DEMOSTRACIÓN</p>
                        <p className="text-xs font-medium">Así es como verías tus metas compartidas.</p>
                    </div>
                </div>

                <div className="bg-yellow-200 border-2 border-black p-4 text-center shadow-[4px_4px_0px_0px_#000]">
                    <span className="font-bold text-sm block mb-1">CÓDIGO DE PAREJA:</span>
                    <span className="font-black text-2xl tracking-widest bg-white px-2 py-1 border-2 border-black block w-fit mx-auto select-all">DEMO-123</span>
                    <p className="text-xs mt-2 font-medium">Ejemplo de código para vincular cuentas.</p>
                </div>

                {CATEGORIES.map(category => {
                    const categoryGoals = groupedGoals[category] || [];
                    if (categoryGoals.length === 0) return null;

                    return (
                        <section key={category}>
                            <div className={cn("inline-block px-3 py-1 border-2 border-black font-bold mb-4 shadow-[2px_2px_0px_0px_#000]", CATEGORY_COLORS[category])}>
                                {category}
                            </div>
                            <div className="space-y-4">
                                {categoryGoals.map(goal => (
                                    <div key={goal.id} className="opacity-80 hover:opacity-100 transition-opacity pointer-events-none grayscale-[0.3]">
                                        <GoalCard goal={goal} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                <div className="text-center pt-8">
                    <p className="mb-4 font-medium">¿Te gusta lo que ves?</p>
                    <Link href="/signup">
                        <Button size="lg" className="w-full animate-bounce">¡CREAR MI CUENTA!</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
