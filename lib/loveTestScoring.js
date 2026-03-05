import { QUESTIONS, DIMENSIONS, SCENARIOS, SCENARIO_PATTERNS } from "./loveTestQuestions";
import { COUPLE_DYNAMICS } from "./loveTestFeedback";

/**
 * Calculate dimension scores from raw answers.
 * @param {Object} answers - { q01: 4, q02: 2, ... }
 * @returns {Object} - { emotional_security: 3.75, trust: 4.0, ... }
 */
export function calculateDimensionScores(answers) {
    const scores = {};

    for (const dim of DIMENSIONS) {
        const dimQuestions = QUESTIONS.filter(q => q.construct === dim.id);
        let total = 0;
        let count = 0;

        for (const q of dimQuestions) {
            const raw = answers[q.id];
            if (raw == null) continue;

            // Reverse-scored: 1→5, 2→4, 3→3, 4→2, 5→1
            const score = q.reverse ? (6 - raw) : raw;
            total += score;
            count++;
        }

        scores[dim.id] = count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    }

    return scores;
}

/**
 * Get interpretation text for a dimension score.
 * @param {number} score - 1-5 scale
 * @returns {{ level: string, color: string, message: string }}
 */
export function getInterpretation(score) {
    if (score >= 4.0) {
        return {
            level: "Fortaleza",
            color: "green",
            message: "Esta es un área fuerte en su relación. Sigan cultivándola.",
        };
    }
    if (score >= 3.0) {
        return {
            level: "Saludable",
            color: "blue",
            message: "Un nivel saludable. Hay espacio para crecer juntos.",
        };
    }
    if (score >= 2.0) {
        return {
            level: "Oportunidad",
            color: "yellow",
            message: "Un área donde pueden trabajar juntos para mejorar.",
        };
    }
    return {
        level: "Atención",
        color: "red",
        message: "Esta área necesita atención. Consideren hablar abiertamente sobre esto.",
    };
}

/**
 * Compare two sets of scores and identify gaps.
 * @param {Object} scoresA - dimension scores for user A
 * @param {Object} scoresB - dimension scores for user B
 * @returns {{ dimension: string, gap: number, gapLevel: string }[]}
 */
export function compareScores(scoresA, scoresB) {
    return DIMENSIONS.map(dim => {
        const a = scoresA[dim.id] || 0;
        const b = scoresB[dim.id] || 0;
        const gap = Math.round(Math.abs(a - b) * 100) / 100;

        let gapLevel;
        if (gap <= 0.5) gapLevel = "aligned";
        else if (gap <= 1.0) gapLevel = "moderate";
        else gapLevel = "divergent";

        return {
            dimension: dim.id,
            name: dim.name,
            scoreA: a,
            scoreB: b,
            gap,
            gapLevel,
        };
    });
}

/**
 * Identify strengths and areas of opportunity from comparison.
 * @param {{ gapLevel: string, name: string }[]} comparison
 * @returns {{ fortalezas: string[], oportunidades: string[] }}
 */
export function getSummary(comparison) {
    const fortalezas = comparison
        .filter(c => c.gapLevel === "aligned")
        .map(c => c.name);

    const oportunidades = comparison
        .filter(c => c.gapLevel === "divergent")
        .map(c => c.name);

    return { fortalezas, oportunidades };
}

// --- Scenario scoring (v2) ---

/**
 * Calculate pattern scores from scenario answers.
 * @param {Object} scenarioAnswers - { s01: "secure", s02: "anxious", ... }
 * @returns {Object} - { mind_reading: 3.5, personalization: 2.0, ... }
 */
export function calculatePatternScores(scenarioAnswers) {
    const scores = {};

    for (const pattern of SCENARIO_PATTERNS) {
        const patternScenarios = SCENARIOS.filter(s => s.pattern === pattern.id);
        let total = 0;
        let count = 0;

        for (const scenario of patternScenarios) {
            const chosenStyle = scenarioAnswers[scenario.id];
            if (!chosenStyle) continue;

            const option = scenario.options.find(o => o.style === chosenStyle);
            if (option) {
                total += option.score;
                count++;
            }
        }

        scores[pattern.id] = count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    }

    return scores;
}

/**
 * Calculate the dominant response style from scenario answers.
 * @param {Object} scenarioAnswers - { s01: "secure", ... }
 * @returns {{ dominant: string, breakdown: Object }}
 */
export function calculateDominantStyle(scenarioAnswers) {
    const breakdown = { secure: 0, anxious: 0, avoidant: 0, reactive: 0 };

    for (const style of Object.values(scenarioAnswers)) {
        if (breakdown[style] !== undefined) {
            breakdown[style]++;
        }
    }

    const dominant = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0][0];
    return { dominant, breakdown };
}

/**
 * Normalize pattern score (1-4) to Likert-compatible scale (1-5).
 * @param {number} score - 1-4 scale
 * @returns {number} - 1-5 scale
 */
export function normalizePatternScore(score) {
    return Math.round(((score - 1) / 3 * 4 + 1) * 100) / 100;
}

/**
 * Get interpretation for a pattern score (1-4 scale).
 * @param {number} score
 * @returns {{ level: string, color: string, message: string }}
 */
export function getPatternInterpretation(score) {
    if (score >= 3.5) {
        return {
            level: "Seguro",
            color: "green",
            message: "Tiendes a responder de manera equilibrada en esta área.",
        };
    }
    if (score >= 2.5) {
        return {
            level: "Moderado",
            color: "blue",
            message: "A veces reaccionas de forma segura y a veces no. Hay espacio para crecer.",
        };
    }
    if (score >= 1.5) {
        return {
            level: "Atención",
            color: "yellow",
            message: "Este patrón se activa con frecuencia en tus reacciones.",
        };
    }
    return {
        level: "Alerta",
        color: "red",
        message: "Este patrón domina tus reacciones en esta área. Vale la pena trabajarlo.",
    };
}

/**
 * Compare two sets of pattern scores.
 * @param {Object} scoresA
 * @param {Object} scoresB
 * @returns {{ pattern: string, name: string, scoreA: number, scoreB: number, gap: number, gapLevel: string }[]}
 */
export function comparePatternScores(scoresA, scoresB) {
    return SCENARIO_PATTERNS.map(pattern => {
        const a = scoresA[pattern.id] || 0;
        const b = scoresB[pattern.id] || 0;
        const gap = Math.round(Math.abs(a - b) * 100) / 100;

        let gapLevel;
        if (gap <= 0.5) gapLevel = "aligned";
        else if (gap <= 1.0) gapLevel = "moderate";
        else gapLevel = "divergent";

        return {
            pattern: pattern.id,
            name: pattern.name,
            scoreA: a,
            scoreB: b,
            gap,
            gapLevel,
        };
    });
}

/**
 * Get couple dynamic based on dominant styles.
 * @param {string} styleA
 * @param {string} styleB
 * @returns {{ title: string, message: string }}
 */
export function getCoupleStyleDynamic(styleA, styleB) {
    const key1 = `${styleA}-${styleB}`;
    const key2 = `${styleB}-${styleA}`;
    return COUPLE_DYNAMICS[key1] || COUPLE_DYNAMICS[key2] || {
        title: "Dinámica Única",
        message: "Su combinación de estilos es particular. Exploren juntos cómo se complementan.",
    };
}
