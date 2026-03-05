import { Card } from "@/components/ui/Card";
import { INTROSPECTION_PROMPTS } from "@/lib/loveTestFeedback";
import { SCENARIO_PATTERNS } from "@/lib/loveTestQuestions";

export function IntrospectionCard({ patternScores, limit = 3 }) {
    // Get the lowest-scoring patterns (most problematic)
    const sorted = Object.entries(patternScores)
        .sort((a, b) => a[1] - b[1])
        .slice(0, limit);

    if (sorted.length === 0) return null;

    return (
        <Card className="bg-purple-50 p-4">
            <h3 className="font-black text-base uppercase mb-1">Para Reflexionar</h3>
            <p className="text-xs text-gray-600 mb-4">
                Preguntas para explorar tus patrones de reacción más activos.
            </p>

            <div className="space-y-4">
                {sorted.map(([patternId, score]) => {
                    const pattern = SCENARIO_PATTERNS.find(p => p.id === patternId);
                    const prompts = INTROSPECTION_PROMPTS[patternId];
                    if (!pattern || !prompts) return null;

                    return (
                        <div key={patternId}>
                            <p className="font-bold text-sm mb-2">
                                {pattern.name} <span className="text-gray-500 font-normal">({score.toFixed(1)}/4.0)</span>
                            </p>
                            <ul className="space-y-1">
                                {prompts.map((prompt, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-purple-500 flex-shrink-0">•</span>
                                        <span>{prompt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
