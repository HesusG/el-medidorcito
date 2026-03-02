import { cn } from "@/lib/utils";
import { LIKERT_OPTIONS } from "@/lib/loveTestQuestions";

export function LikertScale({ question, value, onChange, questionNumber, total }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">
                    Pregunta {questionNumber} de {total}
                </span>
            </div>

            <p className="font-bold text-lg leading-snug">{question.text}</p>

            <div className="flex flex-col gap-2">
                {LIKERT_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "w-full text-left px-4 py-3 border-2 border-black font-bold transition-all",
                            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            value === option.value
                                ? "bg-primary shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_#000]"
                        )}
                    >
                        <span className="flex items-center gap-3">
                            <span className={cn(
                                "w-8 h-8 flex items-center justify-center border-2 border-black text-sm font-black",
                                value === option.value ? "bg-black text-white" : "bg-white"
                            )}>
                                {option.value}
                            </span>
                            <span className="text-sm">{option.label}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
