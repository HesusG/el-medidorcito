"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertCircle } from "lucide-react";

export function AssignModal({ user, couples, onConfirm, onClose }) {
    const [targetId, setTargetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!user) return null;

    const coupleMap = new Map(couples.map(c => [c.id, c]));
    const targetCouple = coupleMap.get(targetId);
    const targetMembers = targetCouple?.members || [];
    const isFull = targetMembers.length >= 2;
    const doesNotExist = targetId && !targetCouple;
    const alreadyHasSpace = !!user.coupleId;

    const handleConfirm = async () => {
        if (!targetId || doesNotExist) return;
        setIsLoading(true);
        try {
            await onConfirm(user.uid, targetId, user.coupleId || null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_#000] max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <h2 className="font-black text-lg uppercase">Asignar a Espacio</h2>
                <p className="text-sm">
                    <span className="font-bold">{user.email}</span>
                    {user.coupleId && (
                        <span className="text-gray-500 ml-2">(actual: {user.coupleId})</span>
                    )}
                </p>

                <Input
                    label="ID del Espacio destino"
                    placeholder="Pegar o escribir coupleId..."
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value.trim())}
                />

                {/* Warnings */}
                {alreadyHasSpace && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-300 p-2 text-xs">
                        <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                        <span>Este usuario ya tiene espacio ({user.coupleId}). Será removido del anterior.</span>
                    </div>
                )}
                {isFull && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-300 p-2 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>El espacio destino ya tiene {targetMembers.length} miembros.</span>
                    </div>
                )}
                {doesNotExist && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-300 p-2 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>El ID ingresado no corresponde a ningún espacio existente.</span>
                    </div>
                )}

                {/* Quick picker */}
                <div>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">
                        O seleccionar un espacio existente:
                    </p>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 divide-y divide-gray-100">
                        {couples.map(c => (
                            <button
                                key={c.id}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-yellow-50 transition-colors ${targetId === c.id ? "bg-yellow-100 font-bold" : ""}`}
                                onClick={() => setTargetId(c.id)}
                            >
                                <span className="font-mono">{c.id}</span>
                                <span className="text-gray-500 ml-2">({(c.members || []).length} miembros)</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!targetId || doesNotExist}
                        isLoading={isLoading}
                        className="flex-1"
                    >
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
}
