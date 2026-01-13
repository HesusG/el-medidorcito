"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { db } from "@/services/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { GoalCard } from "@/components/goals/GoalCard";
import { HelpModal } from "@/components/ui/HelpModal";
import { ProfileModal } from "@/components/ui/ProfileModal";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { Plus, BarChart2, Heart, HelpCircle, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";
import { cn, getWeekKey } from "@/lib/utils";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [goals, setGoals] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [coupleId, setCoupleId] = useState(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [myDisplayName, setMyDisplayName] = useState("");
    const [partnerName, setPartnerName] = useState("Pareja");
    const [dashboardBg, setDashboardBg] = useState("#F9FAFB");

    // Derived state
    const currentWeek = getWeekKey();
    const pendingCount = goals.filter(g => g.lastCheckinWeek !== currentWeek).length;

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
            return;
        }

        if (!loading && user) {
            fetchData();
        }
    }, [user, loading]);

    const fetchData = async () => {
        try {
            // 1. Get User Profile for coupleId
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            setMyDisplayName(userData?.displayName || "");
            setDashboardBg(userData?.preferences?.dashboardBg || "#F9FAFB");

            if (!userData?.coupleId) {
                router.push("/setup");
                return;
            }
            setCoupleId(userData.coupleId);

            // Fetch Partner Profile (avoiding compound index requirement)
            const usersQ = query(
                collection(db, "users"),
                where("coupleId", "==", userData.coupleId)
            );
            const partnerSnap = await getDocs(usersQ);
            const partnerDoc = partnerSnap.docs.find(doc => doc.id !== user.uid);
            if (partnerDoc) {
                const partnerData = partnerDoc.data();
                if (partnerData.displayName) setPartnerName(partnerData.displayName);
            }

            // 2. Get Active Goals
            const q = query(
                collection(db, "goals"),
                where("coupleId", "==", userData.coupleId),
                where("active", "==", true)
            );
            const querySnapshot = await getDocs(q);

            const goalsData = [];

            // 3. For each goal, get latest checkins to verify scores
            for (const docSnap of querySnapshot.docs) {
                const goal = { id: docSnap.id, ...docSnap.data() };

                // Fetch recent checkins
                const checkinsRef = collection(db, "goals", goal.id, "checkins");
                const checkinsQ = query(checkinsRef, orderBy("weekKey", "desc"), limit(10));
                const checkinsSnap = await getDocs(checkinsQ);
                const checkins = checkinsSnap.docs.map(d => d.data());

                // Process scores
                const myCheckins = checkins.filter(c => c.uid === user.uid);
                const partnerCheckins = checkins.filter(c => c.uid !== user.uid);

                const myLatest = myCheckins[0]; // Most recent
                const partnerLatest = partnerCheckins[0]; // Most recent

                const myPrev = myCheckins[1];
                const partnerPrev = partnerCheckins[1];

                // Calc Trend
                const getTrend = (curr, prev) => {
                    if (!curr || !prev) return "flat";
                    if (curr.score > prev.score) return "up";
                    if (curr.score < prev.score) return "down";
                    return "flat";
                };

                goalsData.push({
                    ...goal,
                    myScore: myLatest?.score || 0,
                    partnerScore: partnerLatest?.score || 0,
                    lastCheckinWeek: myLatest?.weekKey,
                    gap: Math.abs((myLatest?.score || 0) - (partnerLatest?.score || 0)),
                    trend: {
                        me: getTrend(myLatest, myPrev),
                        partner: getTrend(partnerLatest, partnerPrev)
                    }
                });
            }

            setGoals(goalsData);
        } catch (err) {
            console.error("Error fetching dashboard:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading || isLoadingData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Group goals by category
    const groupedGoals = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = goals.filter(g => g.category === cat);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pb-20" style={{ backgroundColor: dashboardBg }}>
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                currentName={myDisplayName}
                currentBgColor={dashboardBg}
                onUpdate={(newName) => setMyDisplayName(newName)}
                onBgUpdate={(newBg) => setDashboardBg(newBg)}
            />

            {/* Header */}
            <header className="bg-white border-b-2 border-black p-4 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-danger fill-danger animate-pulse" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">El Medidorcito</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="px-2" onClick={() => setIsProfileOpen(true)}>
                            <Settings className="w-5 h-5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="px-2" onClick={() => setIsHelpOpen(true)}>
                            <HelpCircle className="w-5 h-5" />
                        </Button>
                        <Link href="/insights">
                            <Button size="sm" variant="ghost" className="px-2">
                                <BarChart2 className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/goals/new">
                            <Button size="sm" className="px-2">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Pending Reviews Notification */}
                {pendingCount > 0 && (
                    <div className="bg-pink-100 border-2 border-danger p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_#FF005C]">
                        <AlertCircle className="w-6 h-6 text-danger shrink-0" />
                        <div>
                            <p className="font-bold text-sm text-danger uppercase">¡Revisiones Pendientes!</p>
                            <p className="text-xs font-medium">Te faltan {pendingCount} metas por revisar esta semana.</p>
                        </div>
                    </div>
                )}

                {coupleId && (
                    <div className="bg-yellow-200 border-2 border-black p-4 text-center shadow-[4px_4px_0px_0px_#000]">
                        <span className="font-bold text-sm block mb-1">CÓDIGO DE PAREJA:</span>
                        <span className="font-black text-2xl tracking-widest bg-white px-2 py-1 border-2 border-black block w-fit mx-auto cursor-pointer select-all" title="Copiar">{coupleId}</span>
                        <p className="text-xs mt-2 font-medium">Comparte este código con tu pareja para que se una.</p>
                    </div>
                )}

                {goals.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4 font-medium">Aún no tienen metas compartidas.</p>
                        <Link href="/goals/new">
                            <Button>CREAR PRIMERA META</Button>
                        </Link>
                    </div>
                ) : (
                    CATEGORIES.map(category => {
                        const categoryGoals = groupedGoals[category] || [];
                        if (categoryGoals.length === 0) return null;

                        return (
                            <section key={category}>
                                <div className={cn("inline-block px-3 py-1 border-2 border-black font-bold mb-4 shadow-[2px_2px_0px_0px_#000]", CATEGORY_COLORS[category])}>
                                    {category}
                                </div>
                                <div className="space-y-4">
                                    {categoryGoals.map(goal => (
                                        <GoalCard
                                            key={goal.id}
                                            goal={goal}
                                            myName={myDisplayName || "YO"}
                                            partnerName={partnerName || "PAREJA"}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </main>
        </div>
    );
}
