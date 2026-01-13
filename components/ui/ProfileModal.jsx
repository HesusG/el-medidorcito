"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/services/auth";
import { db } from "@/services/firebase";
import { doc, updateDoc, getDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { X, User, LogOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BG_COLORS = [
    { name: "Rosa", value: "#FFC0CB" },
    { name: "Morado", value: "#E6B3FF" },
    { name: "Azul", value: "#B3D9FF" },
    { name: "Verde", value: "#B3FFB3" },
    { name: "Amarillo", value: "#FFFF99" },
    { name: "Blanco", value: "#F9FAFB" }
];

export function ProfileModal({ isOpen, onClose, currentName, currentBgColor, onUpdate, onBgUpdate }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(currentName || "");
    const [bgColor, setBgColor] = useState(currentBgColor || "#F9FAFB");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(currentName || "");
            setBgColor(currentBgColor || "#F9FAFB");
        }
    }, [isOpen, currentName, currentBgColor]);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: name,
                "preferences.dashboardBg": bgColor
            });
            if (onUpdate) onUpdate(name);
            if (onBgUpdate) onBgUpdate(bgColor);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error al actualizar perfil");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleLeaveSpace = async () => {
        if (!confirm("¿Abandonar este espacio?\n\nPodrás crear un nuevo espacio o unirte al de tu pareja.\nLas metas compartidas permanecerán para tu pareja.")) {
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const coupleId = userDoc.data()?.coupleId;

            if (!coupleId) {
                alert("No tienes un espacio activo");
                return;
            }

            // Just remove coupleId from user (don't delete goals or couple)
            await updateDoc(doc(db, "users", user.uid), { coupleId: null });

            alert("Has abandonado el espacio exitosamente");
            onClose();
            router.push("/setup");
        } catch (error) {
            console.error("Error leaving space:", error);
            alert("Error al abandonar el espacio. Intenta de nuevo.");
        }
    };

    const handleDeleteSpace = async () => {
        if (!confirm("⚠️ ¿Estás COMPLETAMENTE seguro de eliminar este espacio?\n\nEsto eliminará:\n- Todas las metas compartidas\n- Todo el historial de check-ins\n- La conexión con tu pareja\n\nEsta acción NO se puede deshacer.")) {
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const coupleId = userDoc.data()?.coupleId;

            if (!coupleId) {
                alert("No tienes un espacio activo");
                return;
            }

            // Delete all goals for this couple
            const goalsQuery = query(collection(db, "goals"), where("coupleId", "==", coupleId));
            const goalsSnapshot = await getDocs(goalsQuery);
            const deletePromises = goalsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Remove coupleId from user
            await updateDoc(doc(db, "users", user.uid), { coupleId: null });

            // Delete couple document
            await deleteDoc(doc(db, "couples", coupleId));

            alert("Espacio eliminado exitosamente");
            onClose();
            router.push("/setup");
        } catch (error) {
            console.error("Error deleting space:", error);
            alert("Error al eliminar el espacio. Intenta de nuevo.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-sm relative animate-in fade-in zoom-in duration-200 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <User className="w-12 h-12 text-primary mx-auto mb-2 fill-primary" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Mi Perfil</h2>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <Input
                        label="Tu Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Juan"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm uppercase tracking-wide">Color de Fondo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {BG_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setBgColor(color.value)}
                                    className={`p-3 border-2 border-black font-bold text-xs transition-all ${bgColor === color.value
                                        ? "shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                                        : "hover:shadow-[2px_2px_0px_0px_#000]"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isSaving}>
                        GUARDAR CAMBIOS
                    </Button>
                </form>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-300">
                    <Button
                        variant="ghost"
                        className="w-full text-danger hover:bg-red-50 hover:text-danger flex items-center justify-center gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        CERRAR SESIÓN
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full mt-2 text-orange-600 hover:bg-orange-100 hover:text-orange-700 flex items-center justify-center gap-2 border-2 border-orange-300"
                        onClick={handleLeaveSpace}
                    >
                        <LogOut className="w-5 h-5" />
                        ABANDONAR ESPACIO
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full mt-2 text-red-600 hover:bg-red-100 hover:text-red-700 flex items-center justify-center gap-2 border-2 border-red-300"
                        onClick={handleDeleteSpace}
                    >
                        <Trash2 className="w-5 h-5" />
                        ELIMINAR ESPACIO
                    </Button>
                </div>
            </Card>
        </div>
    );
}
