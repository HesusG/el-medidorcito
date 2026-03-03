import { cn } from "@/lib/utils";

export function Input({ className, label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="font-bold text-sm uppercase tracking-wide">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full px-4 py-2 bg-white border-2 border-black outline-none",
                    "focus:shadow-[4px_4px_0px_0px_#000] transition-shadow",
                    "placeholder:text-gray-500",
                    error && "border-danger bg-red-50",
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-danger text-xs font-bold">{error}</span>
            )}
        </div>
    );
}
