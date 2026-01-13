import { cn } from "@/lib/utils";

export function Button({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    children,
    ...props
}) {
    const variants = {
        primary: "bg-primary text-black hover:bg-yellow-300",
        secondary: "bg-secondary text-black hover:bg-orange-300",
        accent: "bg-accent text-white hover:bg-blue-600",
        danger: "bg-danger text-white hover:bg-red-500",
        outline: "bg-white text-black hover:bg-gray-100",
        ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
    };

    return (
        <button
            className={cn(
                "font-bold transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                "border-2 border-black shadow-[4px_4px_0px_0px_#000]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_#000]",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? "Cargando..." : children}
        </button>
    );
}
