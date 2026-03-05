import { cn } from "@/lib/utils";

export function ResultsTabs({ activeTab, onTabChange, coupleReady }) {
    return (
        <div className="flex border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <button
                onClick={() => onTabChange("personal")}
                className={cn(
                    "flex-1 py-3 px-4 font-bold text-sm uppercase transition-colors border-r-2 border-black",
                    activeTab === "personal"
                        ? "bg-primary text-black"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                )}
            >
                Vista Personal
            </button>
            <button
                onClick={() => coupleReady && onTabChange("couple")}
                disabled={!coupleReady}
                className={cn(
                    "flex-1 py-3 px-4 font-bold text-sm uppercase transition-colors",
                    activeTab === "couple"
                        ? "bg-primary text-black"
                        : coupleReady
                            ? "bg-white text-gray-500 hover:bg-gray-50"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
            >
                Vista de Pareja
            </button>
        </div>
    );
}
