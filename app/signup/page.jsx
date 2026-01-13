"use client";

import { useState } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Create Auth User
            const userCredential = await signup(email, password);
            const user = userCredential.user;

            // 2. Create User Profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: serverTimestamp(),
                // coupleId will be set in /setup
            });

            router.push("/setup");
        } catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado.");
            } else if (err.code === "auth/weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("Error al registrarse. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">
                        Únete
                    </h1>
                    <p className="text-gray-600 font-medium">Crea tu cuenta en El Medidorcito</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border-2 border-danger text-danger p-3 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Correo Electrónico"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                    />

                    <Button variant="secondary" type="submit" className="w-full" isLoading={loading}>
                        CREAR CUENTA
                    </Button>
                </form>

                <div className="text-center text-sm font-bold">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-accent hover:underline">
                        Entra aquí
                    </Link>
                </div>
            </Card>
        </div>
    );
}
