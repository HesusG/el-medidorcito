"use client";

import { useState } from "react";
import { useAuth } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            if (err.code === "auth/invalid-credential") {
                setError("Correo o contraseña incorrectos.");
            } else {
                setError("Error al iniciar sesión. Intenta de nuevo.");
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
                        El Medidorcito
                    </h1>
                    <p className="text-gray-600 font-medium">Inicia sesión para continuar</p>
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
                        placeholder="hola@ejemplo.com"
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        ENTRAR
                    </Button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm">
                        ¿No tienes cuenta? <Link href="/signup" className="font-bold underline">Regístrate</Link>
                    </p>
                    <div className="mt-4 border-t-2 border-dashed border-gray-300 pt-4">
                        <Link href="/demo">
                            <Button variant="outline" className="w-full bg-yellow-100 hover:bg-yellow-200">
                                PROBAR DEMO (SIN REGISTRO)
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
