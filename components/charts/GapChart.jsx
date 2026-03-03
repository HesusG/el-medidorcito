"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function GapChart({ data }) {
    return (
        <div className="h-80 w-full bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis domain={[0, 5]} tickCount={6} />
                    <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '0px', boxShadow: '4px 4px 0px 0px #000' }} />
                    <Legend />
                    <Bar dataKey="myScore" name="Yo" fill="#000000" />
                    <Bar dataKey="partnerScore" name="Pareja" fill="#FF5757" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
