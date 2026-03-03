"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Trash2, UserMinus, UserPlus } from "lucide-react";

function SpaceBadge({ label, color }) {
    return (
        <span className={`${color} text-xs font-bold px-2 py-0.5 border border-black`}>
            {label}
        </span>
    );
}

export function SpacesSection({ couples, users, onDeleteSpace, onRemoveMember, onAddUser }) {
    const userMap = new Map(users.map(u => [u.uid, u]));

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold uppercase text-gray-500">
                {couples.length} espacios
            </p>

            {couples.map(couple => {
                const members = couple.members || [];
                const realMembers = members.filter(uid => userMap.has(uid));
                const ghostMembers = members.filter(uid => !userMap.has(uid));
                const isSolo = realMembers.length === 1 && ghostMembers.length === 0;
                const isEmpty = members.length === 0;
                const isOverfull = members.length > 2;
                const hasGhosts = ghostMembers.length > 0;

                // Collect real UIDs only for delete
                const realUids = realMembers;

                return (
                    <Card key={couple.id} className="p-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-mono font-bold text-sm">{couple.id}</p>
                                <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                                    {isSolo && <SpaceBadge label="SOLO" color="bg-yellow-200" />}
                                    {isEmpty && <SpaceBadge label="VACÍO" color="bg-red-200" />}
                                    {isOverfull && <SpaceBadge label="OVERFULL" color="bg-red-200" />}
                                    {hasGhosts && <SpaceBadge label="ORPHANED" color="bg-orange-200" />}
                                </div>
                            </div>

                            <div className="text-xs space-y-1">
                                <p className="font-bold uppercase text-gray-500">
                                    Miembros ({members.length}):
                                </p>
                                {realMembers.map(uid => {
                                    const u = userMap.get(uid);
                                    return (
                                        <div key={uid} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-2 py-1">
                                            <span className="font-mono truncate">
                                                {u.email} {u.displayName && `(${u.displayName})`}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="px-1 py-0 border-0 shadow-none"
                                                onClick={() => onRemoveMember(uid, couple.id)}
                                            >
                                                <UserMinus className="w-3.5 h-3.5 text-danger" />
                                            </Button>
                                        </div>
                                    );
                                })}
                                {ghostMembers.map(uid => (
                                    <div key={uid} className="flex items-center justify-between bg-orange-50 border border-orange-200 px-2 py-1">
                                        <span className="font-mono text-orange-700">
                                            GHOST: {uid}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="px-1 py-0 border-0 shadow-none"
                                            onClick={() => onRemoveMember(uid, couple.id)}
                                        >
                                            <UserMinus className="w-3.5 h-3.5 text-orange-600" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAddUser(couple)}
                                >
                                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                                    Agregar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => {
                                        if (confirm(`¿Eliminar espacio ${couple.id}? Se borrarán las metas asociadas.`)) {
                                            onDeleteSpace(couple.id, realUids);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
