export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

export const CATEGORIES = [
    "Conexión",
    "Hogar & Logística",
    "Crecimiento",
    "Aventura & Diversión"
];

export const CATEGORY_COLORS = {
    "Conexión": "bg-pink-200",
    "Hogar & Logística": "bg-purple-200",
    "Crecimiento": "bg-green-200",
    "Aventura & Diversión": "bg-yellow-200"
};
