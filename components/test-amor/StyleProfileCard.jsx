import { Card } from "@/components/ui/Card";
import { RESPONSE_STYLES } from "@/lib/loveTestQuestions";
import { cn } from "@/lib/utils";

export function StyleProfileCard({ dominantStyle, styleBreakdown, label = "Tu Estilo Dominante" }) {
    const style = RESPONSE_STYLES[dominantStyle];
    const total = Object.values(styleBreakdown).reduce((a, b) => a + b, 0);

    return (
        <Card className={cn("p-4", style?.color || "bg-gray-100")}>
            <h3 className="font-black text-xs uppercase text-gray-600 mb-1">{label}</h3>
            <p className="font-black text-2xl uppercase mb-1">{style?.name || dominantStyle}</p>
            <p className="text-sm text-gray-700 mb-4">{style?.description}</p>

            <div className="space-y-2">
                {Object.entries(RESPONSE_STYLES).map(([key, s]) => {
                    const count = styleBreakdown[key] || 0;
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <div key={key}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>{s.name}</span>
                                <span>{percent}% ({count})</span>
                            </div>
                            <div className="h-3 bg-white border-2 border-black">
                                <div
                                    className={cn("h-full transition-all", s.color)}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
