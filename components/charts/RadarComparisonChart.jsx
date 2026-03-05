"use client";

import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

export function RadarComparisonChart({
    data,
    nameA = "Yo",
    nameB = "Pareja",
    singleMode = false,
    domain = [0, 5],
}) {
    const tickCount = domain[1] + 1;

    return (
        <div className="h-80 w-full bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#000" strokeWidth={1} />
                    <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fontSize: 10, fontWeight: "bold", fill: "#000" }}
                    />
                    <PolarRadiusAxis
                        domain={domain}
                        tickCount={tickCount}
                        tick={{ fontSize: 9 }}
                        axisLine={false}
                    />
                    <Radar
                        name={nameA}
                        dataKey="scoreA"
                        stroke="#000000"
                        fill="#000000"
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                    {!singleMode && (
                        <Radar
                            name={nameB}
                            dataKey="scoreB"
                            stroke="#FF005C"
                            fill="#FF005C"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                    )}
                    <Legend
                        wrapperStyle={{ fontSize: 12, fontWeight: "bold" }}
                    />
                    <Tooltip
                        contentStyle={{
                            border: "2px solid black",
                            borderRadius: "0px",
                            boxShadow: "4px 4px 0px 0px #000",
                            fontSize: 12,
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
