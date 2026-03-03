"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, UserMinus, ArrowRightLeft } from "lucide-react";

function UserBadge({ label, color }) {
    return (
        <span className={`${color} text-xs font-bold px-2 py-0.5 border border-black`}>
            {label}
        </span>
    );
}

export function UsersSection({ users, couples, onResetPassword, onAssign, onRemove }) {
    const [search, setSearch] = useState("");

    const coupleMap = new Map(couples.map(c => [c.id, c]));

    const filtered = users.filter(u => {
        const term = search.toLowerCase();
        if (!term) return true;
        return (
            (u.email || "").toLowerCase().includes(term) ||
            (u.displayName || "").toLowerCase().includes(term) ||
            (u.uid || "").toLowerCase().includes(term) ||
            (u.coupleId || "").toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-4">
            <Input
                placeholder="Buscar por email, nombre, uid, coupleId..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <p className="text-xs font-bold uppercase text-gray-500">
                {filtered.length} de {users.length} usuarios
            </p>

            <div className="space-y-3">
                {filtered.map(user => {
                    const hasCouple = !!user.coupleId;
                    const coupleExists = hasCouple && coupleMap.has(user.coupleId);
                    const isOrphaned = hasCouple && !coupleExists;

                    return (
                        <Card key={user.uid} className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{user.email}</p>
                                        {user.displayName && (
                                            <p className="text-xs text-gray-600">{user.displayName}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                                        {user.role === "admin" && (
                                            <UserBadge label="ADMIN" color="bg-purple-200" />
                                        )}
                                        {!hasCouple && (
                                            <UserBadge label="SIN ESPACIO" color="bg-red-200" />
                                        )}
                                        {isOrphaned && (
                                            <UserBadge label="ORPHANED" color="bg-orange-200" />
                                        )}
                                    </div>
                                </div>

                                <div className="text-xs font-mono text-gray-500 space-y-0.5">
                                    <p>UID: {user.uid}</p>
                                    <p>Espacio: {user.coupleId || "—"}</p>
                                    {user.createdAt && (
                                        <p>Creado: {new Date(user.createdAt?.seconds ? user.createdAt.seconds * 1000 : user.createdAt).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 flex-wrap pt-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onResetPassword(user.email)}
                                    >
                                        <Mail className="w-3.5 h-3.5 mr-1" />
                                        Reset Pass
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onAssign(user)}
                                    >
                                        <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                                        Asignar
                                    </Button>
                                    {hasCouple && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => onRemove(user.uid, user.coupleId)}
                                        >
                                            <UserMinus className="w-3.5 h-3.5 mr-1" />
                                            Quitar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
