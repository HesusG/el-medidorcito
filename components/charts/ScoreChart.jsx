"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ScoreChart({ data }) {
    return (
        <div className="h-64 w-full bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 5]} tickCount={6} />
                    <Tooltip contentStyle={{ border: '2px solid black', borderRadius: '0px', boxShadow: '4px 4px 0px 0px #000' }} />
                    <Line type="monotone" dataKey="me" stroke="#000000" strokeWidth={3} dot={{ r: 4, fill: "black" }} activeDot={{ r: 6 }} name="Yo" />
                    <Line type="monotone" dataKey="partner" stroke="#FF5757" strokeWidth={3} dot={{ r: 4, fill: "#FF5757" }} name="Pareja" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
