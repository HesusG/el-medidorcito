"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X, Heart, TrendingUp, AlertCircle } from "lucide-react";

export function HelpModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-200 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <Heart className="w-12 h-12 text-danger mx-auto mb-2 fill-danger" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">¿Cómo funciona?</h2>
                    <p className="text-gray-600 font-medium">El ritual del Medidorcito</p>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="bg-pink-100 border-2 border-black p-3 flex gap-3 items-start">
                        <div className="bg-white border-2 border-black p-1 rounded-full shrink-0">
                            <span className="font-black text-lg block w-6 h-6 text-center leading-6">1</span>
                        </div>
                        <div>
                            <p className="font-bold uppercase mb-1">Creen Metas Compartidas</p>
                            <p>Definan qué es importante para ustedes en las 4 categorías clave.</p>
                        </div>
                    </div>

                    <div className="bg-purple-100 border-2 border-black p-3 flex gap-3 items-start">
                        <div className="bg-white border-2 border-black p-1 rounded-full shrink-0">
                            <span className="font-black text-lg block w-6 h-6 text-center leading-6">2</span>
                        </div>
                        <div>
                            <p className="font-bold uppercase mb-1">Check-in Semanal</p>
                            <p>Cada semana, califiquen del 1 al 5 cómo se sintieron en cada meta.</p>
                        </div>
                    </div>

                    <div className="bg-yellow-100 border-2 border-black p-3 flex gap-3 items-start">
                        <div className="bg-white border-2 border-black p-1 rounded-full shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold uppercase mb-1">Revisen la Brecha</p>
                            <p>Lo importante no es solo el puntaje, sino la diferencia de percepción entre los dos.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Button onClick={onClose} className="w-full" size="lg">¡ENTENDIDO!</Button>
                </div>
            </Card>
        </div>
    );
}
