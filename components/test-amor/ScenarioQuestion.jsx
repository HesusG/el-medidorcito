import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function ScenarioQuestion({ scenario, value, onChange, questionNumber, total }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">
                    Pregunta {questionNumber} de {total}
                </span>
            </div>

            <p className="font-bold text-lg leading-snug">{scenario.text}</p>

            <div className="flex flex-col gap-2">
                {scenario.options.map((option, idx) => (
                    <button
                        key={option.style}
                        type="button"
                        onClick={() => onChange(option.style)}
                        className={cn(
                            "w-full text-left px-4 py-3 border-2 border-black font-bold transition-all",
                            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                            value === option.style
                                ? "bg-primary shadow-[2px_2px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_#000]"
                        )}
                    >
                        <span className="flex items-start gap-3">
                            <span className={cn(
                                "w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 border-black text-sm font-black",
                                value === option.style ? "bg-black text-white" : "bg-white"
                            )}>
                                {OPTION_LETTERS[idx]}
                            </span>
                            <span className="text-sm">{option.label}</span>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
