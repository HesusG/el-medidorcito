import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { MoveRight, MoveUp, MoveDown, MessageSquare } from "lucide-react";
import Link from "next/link";

export function GoalCard({ goal, myName = "YO", partnerName = "PAREJA" }) {
    const { title, category, id, myScore, partnerScore, gap, trend } = goal;

    const getTrendIcon = (t) => {
        if (t === "up") return <MoveUp className="w-4 h-4 text-green-600" />;
        if (t === "down") return <MoveDown className="w-4 h-4 text-red-600" />;
        return <MoveRight className="w-4 h-4 text-gray-400" />;
    };

    const gapColor = gap === 0 ? "bg-green-200" : gap <= 1 ? "bg-yellow-200" : "bg-red-200";

    const isOngoing = goal.type === "ongoing";

    return (
        <Link href={`/goals/${id}`}>
            <Card
                className="p-4 hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer relative group"
                style={{ backgroundColor: goal.cardColor || "#FFFFFF" }}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg leading-tight pr-8">{title}</h3>
                    {isOngoing ? (
                        <span className={cn("px-2 py-1 text-xs font-bold border-2 border-black bg-accent text-white")}>
                            EN CURSO
                        </span>
                    ) : (
                        <span className={cn("px-2 py-1 text-xs font-bold border-2 border-black", gapColor)}>
                            GAP: {gap}
                        </span>
                    )}
                </div>

                {isOngoing ? (
                    <div className="p-4 bg-gray-50 border-2 border-black/10 text-center">
                        <MessageSquare className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                        <span className="text-xs font-bold uppercase text-gray-500">VER ACTIVIDAD</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Me */}
                        <div className="text-center p-2 bg-gray-50 border-2 border-black/10">
                            <span className="text-xs font-bold uppercase text-gray-500 block truncate px-1">{myName}</span>
                            <div className="text-3xl font-black">{myScore || "-"}</div>
                            <div className="flex justify-center mt-1">{getTrendIcon(trend?.me)}</div>
                        </div>

                        {/* Partner */}
                        <div className="text-center p-2 bg-gray-50 border-2 border-black/10">
                            <span className="text-xs font-bold uppercase text-gray-500 block truncate px-1">{partnerName}</span>
                            <div className="text-3xl font-black">{partnerScore || "-"}</div>
                            <div className="flex justify-center mt-1">{getTrendIcon(trend?.partner)}</div>
                        </div>
                    </div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Visual cue that it's clickable */}
                </div>
            </Card>
        </Link>
    );
}
