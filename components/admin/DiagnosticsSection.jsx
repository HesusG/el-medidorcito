"use client";

import { Card } from "@/components/ui/Card";

function StatCard({ label, value, color = "bg-green-100" }) {
    return (
        <div className={`${color} border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]`}>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs font-bold uppercase tracking-wide mt-1">{label}</p>
        </div>
    );
}

export function DiagnosticsSection({ diagnostics }) {
    if (!diagnostics) return null;

    const {
        totalUsers,
        totalCouples,
        orphanedUsers,
        unpairedUsers,
        orphanedCouples,
        emptyCouples,
        soloCouples,
        overfullCouples
    } = diagnostics;

    return (
        <div className="space-y-4">
            <h2 className="font-black text-lg uppercase">Resumen del Sistema</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Total Usuarios" value={totalUsers} />
                <StatCard label="Total Espacios" value={totalCouples} />
                <StatCard
                    label="Sin Espacio"
                    value={unpairedUsers.length}
                    color={unpairedUsers.length > 0 ? "bg-yellow-100" : "bg-green-100"}
                />
                <StatCard
                    label="Huérfanos (Users)"
                    value={orphanedUsers.length}
                    color={orphanedUsers.length > 0 ? "bg-red-100" : "bg-green-100"}
                />
                <StatCard
                    label="Espacios Solo"
                    value={soloCouples.length}
                    color={soloCouples.length > 0 ? "bg-yellow-100" : "bg-green-100"}
                />
                <StatCard
                    label="Espacios Vacíos"
                    value={emptyCouples.length}
                    color={emptyCouples.length > 0 ? "bg-red-100" : "bg-green-100"}
                />
                <StatCard
                    label="Espacios con Ghosts"
                    value={orphanedCouples.length}
                    color={orphanedCouples.length > 0 ? "bg-orange-100" : "bg-green-100"}
                />
                <StatCard
                    label="Overfull (>2)"
                    value={overfullCouples.length}
                    color={overfullCouples.length > 0 ? "bg-red-100" : "bg-green-100"}
                />
            </div>

            {orphanedUsers.length > 0 && (
                <Card className="bg-orange-50">
                    <h3 className="font-bold text-sm uppercase mb-2">Usuarios Huérfanos</h3>
                    <p className="text-xs mb-2">Tienen coupleId apuntando a un espacio que no existe.</p>
                    <ul className="text-xs space-y-1">
                        {orphanedUsers.map(u => (
                            <li key={u.uid} className="font-mono">{u.email} → {u.coupleId}</li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
}
