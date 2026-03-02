import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getInterpretation } from "@/lib/loveTestScoring";
import { ShieldCheck, Shield, MessageCircle, Heart, HeartCrack, User } from "lucide-react";

const ICON_MAP = {
    ShieldCheck,
    Shield,
    MessageCircle,
    Heart,
    HeartCrack,
    User,
};

const GAP_COLORS = {
    aligned: "bg-green-200",
    moderate: "bg-yellow-200",
    divergent: "bg-red-200",
};

const GAP_LABELS = {
    aligned: "Alineados",
    moderate: "Moderado",
    divergent: "Divergente",
};

export function DimensionCard({ dimension, scoreA, scoreB, gap, gapLevel, myName = "Yo", partnerName = "Pareja" }) {
    const Icon = ICON_MAP[dimension.icon] || Heart;
    const interpA = getInterpretation(scoreA);
    const interpB = getInterpretation(scoreB);

    const scoreBarWidth = (score) => `${(score / 5) * 100}%`;

    const SCORE_COLORS = {
        green: "bg-green-400",
        blue: "bg-blue-400",
        yellow: "bg-yellow-400",
        red: "bg-red-400",
    };

    return (
        <Card className={cn("p-4", dimension.color)}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-black text-base uppercase">{dimension.name}</h3>
                </div>
                <span className={cn(
                    "px-2 py-1 text-xs font-bold border-2 border-black",
                    GAP_COLORS[gapLevel]
                )}>
                    {GAP_LABELS[gapLevel]}
                </span>
            </div>

            <p className="text-xs text-gray-600 mb-3">{dimension.description}</p>

            {/* Score bars */}
            <div className="space-y-2">
                {/* User A */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="uppercase">{myName}</span>
                        <span>{scoreA.toFixed(1)}</span>
                    </div>
                    <div className="h-4 bg-white border-2 border-black">
                        <div
                            className={cn("h-full", SCORE_COLORS[interpA.color] || "bg-gray-400")}
                            style={{ width: scoreBarWidth(scoreA) }}
                        />
                    </div>
                </div>

                {/* User B */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="uppercase">{partnerName}</span>
                        <span>{scoreB.toFixed(1)}</span>
                    </div>
                    <div className="h-4 bg-white border-2 border-black">
                        <div
                            className={cn("h-full", SCORE_COLORS[interpB.color] || "bg-gray-400")}
                            style={{ width: scoreBarWidth(scoreB) }}
                        />
                    </div>
                </div>
            </div>

            {/* Gap */}
            <div className="mt-3 text-xs font-medium text-gray-600">
                <span className="font-bold">Diferencia:</span> {gap.toFixed(1)} punto{gap !== 1 ? "s" : ""}
            </div>
        </Card>
    );
}
