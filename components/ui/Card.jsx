import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
