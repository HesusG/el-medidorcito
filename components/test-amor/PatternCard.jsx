import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getPatternInterpretation } from "@/lib/loveTestScoring";
import { FeedbackSection } from "./FeedbackSection";
import { Brain, Target, MessageSquareHeart, CloudLightning, Flame } from "lucide-react";

const ICON_MAP = {
    Brain,
    Target,
    MessageSquareHeart,
    CloudLightning,
    Flame,
};

const SCORE_COLORS = {
    green: "bg-green-400",
    blue: "bg-blue-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
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

export function PatternCard({
    pattern,
    scoreA,
    scoreB,
    gap,
    gapLevel,
    mode = "couple",
    myName = "Yo",
    partnerName = "Pareja",
    feedback,
}) {
    const Icon = ICON_MAP[pattern.icon] || Brain;
    const interpA = getPatternInterpretation(scoreA);
    const scoreBarWidth = (score) => `${(score / 4) * 100}%`;

    return (
        <Card className={cn("p-4", pattern.color)}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-black text-base uppercase">{pattern.name}</h3>
                </div>
                {mode === "couple" && gapLevel && (
                    <span className={cn(
                        "px-2 py-1 text-xs font-bold border-2 border-black",
                        GAP_COLORS[gapLevel]
                    )}>
                        {GAP_LABELS[gapLevel]}
                    </span>
                )}
                {mode === "personal" && (
                    <span className={cn(
                        "px-2 py-1 text-xs font-bold border-2 border-black",
                        SCORE_COLORS[interpA.color] || "bg-gray-200"
                    )}>
                        {interpA.level}
                    </span>
                )}
            </div>

            <p className="text-xs text-gray-600 mb-3">{pattern.description}</p>

            {/* Score bars */}
            <div className="space-y-2">
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="uppercase">{myName}</span>
                        <span>{scoreA.toFixed(1)}/4.0</span>
                    </div>
                    <div className="h-4 bg-white border-2 border-black">
                        <div
                            className={cn("h-full", SCORE_COLORS[interpA.color] || "bg-gray-400")}
                            style={{ width: scoreBarWidth(scoreA) }}
                        />
                    </div>
                </div>

                {mode === "couple" && scoreB != null && (
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="uppercase">{partnerName}</span>
                            <span>{scoreB.toFixed(1)}/4.0</span>
                        </div>
                        <div className="h-4 bg-white border-2 border-black">
                            <div
                                className={cn("h-full", SCORE_COLORS[getPatternInterpretation(scoreB).color] || "bg-gray-400")}
                                style={{ width: scoreBarWidth(scoreB) }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {mode === "couple" && gap != null && (
                <div className="mt-3 text-xs font-medium text-gray-600">
                    <span className="font-bold">Diferencia:</span> {gap.toFixed(1)} punto{gap !== 1 ? "s" : ""}
                </div>
            )}

            {feedback && (
                <div className="mt-4">
                    <FeedbackSection feedback={feedback} />
                </div>
            )}
        </Card>
    );
}
