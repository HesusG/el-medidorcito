"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DiagnosticsSection } from "@/components/admin/DiagnosticsSection";
import { UsersSection } from "@/components/admin/UsersSection";
import { SpacesSection } from "@/components/admin/SpacesSection";
import { AssignModal } from "@/components/admin/AssignModal";
import {
    getAllUsers,
    getAllCouples,
    assignUserToSpace,
    removeUserFromSpace,
    deleteSpace,
    computeDiagnostics
} from "@/services/adminData";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const TABS = [
    { key: "diagnostics", label: "Diagnósticos" },
    { key: "users", label: "Usuarios" },
    { key: "spaces", label: "Espacios" },
];

export default function AdminPage() {
    const { user, loading, isAdmin, resetPassword } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("diagnostics");
    const [users, setUsers] = useState([]);
    const [couples, setCouples] = useState([]);
    const [diagnostics, setDiagnostics] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [assignTarget, setAssignTarget] = useState(null);

    const showFeedback = useCallback((message, type = "success") => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback(null), 5000);
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const [usersData, couplesData] = await Promise.all([
                getAllUsers(),
                getAllCouples()
            ]);
            setUsers(usersData);
            setCouples(couplesData);
            setDiagnostics(computeDiagnostics(usersData, couplesData));
        } catch (err) {
            console.error("Admin fetch error:", err);
            showFeedback("Error al cargar datos: " + err.message, "error");
        } finally {
            setIsLoadingData(false);
        }
    }, [showFeedback]);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }
        if (!loading && user && !isAdmin) {
            router.push("/dashboard");
            return;
        }
        if (!loading && user && isAdmin) {
            fetchData();
        }
    }, [user, loading, isAdmin, router, fetchData]);

    const handleResetPassword = async (email) => {
        try {
            await resetPassword(email);
            showFeedback(`Email de reset enviado a ${email}`);
        } catch (err) {
            showFeedback("Error: " + err.message, "error");
        }
    };

    const handleAssign = async (uid, newCoupleId, oldCoupleId) => {
        try {
            await assignUserToSpace(uid, newCoupleId, oldCoupleId);
            showFeedback("Usuario asignado correctamente");
            setAssignTarget(null);
            await fetchData();
        } catch (err) {
            showFeedback("Error: " + err.message, "error");
        }
    };

    const handleRemove = async (uid, coupleId) => {
        if (!confirm("¿Quitar este usuario del espacio?")) return;
        try {
            await removeUserFromSpace(uid, coupleId);
            showFeedback("Usuario removido del espacio");
            await fetchData();
        } catch (err) {
            showFeedback("Error: " + err.message, "error");
        }
    };

    const handleDeleteSpace = async (coupleId, memberUids) => {
        try {
            await deleteSpace(coupleId, memberUids);
            showFeedback("Espacio eliminado correctamente");
            await fetchData();
        } catch (err) {
            showFeedback("Error: " + err.message, "error");
        }
    };

    if (loading || (user && isAdmin && isLoadingData)) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Assign Modal */}
            {assignTarget && (
                <AssignModal
                    user={assignTarget}
                    couples={couples}
                    onConfirm={handleAssign}
                    onClose={() => setAssignTarget(null)}
                />
            )}

            {/* Feedback Banner */}
            {feedback && (
                <div className={`fixed top-0 left-0 right-0 z-50 p-3 text-center font-bold text-sm border-b-2 border-black ${
                    feedback.type === "error" ? "bg-red-200 text-red-900" : "bg-green-200 text-green-900"
                }`}>
                    {feedback.message}
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard">
                            <Button size="sm" variant="ghost" className="px-2">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Shield className="w-6 h-6 text-purple-600" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">Admin Panel</h1>
                    </div>
                    <Button size="sm" variant="outline" onClick={fetchData}>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4 pt-4">
                <div className="flex gap-2 border-b-2 border-black pb-0">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 font-bold text-sm uppercase transition-colors border-2 border-black border-b-0 -mb-[2px] ${
                                activeTab === tab.key
                                    ? "bg-primary text-black"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <main className="max-w-4xl mx-auto p-4">
                {activeTab === "diagnostics" && (
                    <DiagnosticsSection diagnostics={diagnostics} />
                )}

                {activeTab === "users" && (
                    <UsersSection
                        users={users}
                        couples={couples}
                        onResetPassword={handleResetPassword}
                        onAssign={(user) => setAssignTarget(user)}
                        onRemove={handleRemove}
                    />
                )}

                {activeTab === "spaces" && (
                    <SpacesSection
                        couples={couples}
                        users={users}
                        onDeleteSpace={handleDeleteSpace}
                        onRemoveMember={handleRemove}
                        onAddUser={(couple) => setAssignTarget({ coupleId: null, email: "", uid: "", _preselectedCoupleId: couple.id })}
                    />
                )}
            </main>
        </div>
    );
}
