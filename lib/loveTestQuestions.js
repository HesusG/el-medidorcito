/**
 * Love Test Questions — derived from scientifically validated instruments.
 * See research/constructs.json for full theoretical backing.
 */

export const DIMENSIONS = [
    {
        id: "emotional_security",
        name: "Seguridad Emocional",
        icon: "ShieldCheck",
        color: "bg-blue-200",
        description: "Qué tan seguro/a te sientes emocionalmente en tu relación.",
    },
    {
        id: "trust",
        name: "Confianza",
        icon: "Shield",
        color: "bg-green-200",
        description: "Tu nivel de confianza en las intenciones y acciones de tu pareja.",
    },
    {
        id: "communication",
        name: "Comunicación",
        icon: "MessageCircle",
        color: "bg-yellow-200",
        description: "La calidad del diálogo y manejo de conflictos entre ustedes.",
    },
    {
        id: "attachment",
        name: "Apego",
        icon: "Heart",
        color: "bg-pink-200",
        description: "Qué tan seguro/a te sientes en la disponibilidad de tu pareja.",
    },
    {
        id: "abandonment",
        name: "Miedo al Abandono",
        icon: "HeartCrack",
        color: "bg-red-200",
        description: "Tu nivel de tranquilidad respecto a la estabilidad de la relación.",
    },
    {
        id: "independence",
        name: "Independencia",
        icon: "User",
        color: "bg-purple-200",
        description: "Tu capacidad de mantener tu identidad dentro de la relación.",
    },
];

export const QUESTIONS = [
    // Emotional Security (5 questions)
    { id: "q01", construct: "emotional_security", text: "Me siento seguro/a expresando mis emociones más profundas con mi pareja.", reverse: false },
    { id: "q02", construct: "emotional_security", text: "Cuando no estamos de acuerdo, aún me siento emocionalmente seguro/a en nuestra relación.", reverse: false },
    { id: "q03", construct: "emotional_security", text: "Me preocupa que los conflictos puedan dañar seriamente nuestra relación.", reverse: true },
    { id: "q04", construct: "emotional_security", text: "Las reacciones emocionales de mi pareja me parecen impredecibles.", reverse: true },
    { id: "q25", construct: "emotional_security", text: "Después de un desacuerdo, mi pareja y yo podemos reconectarnos y reparar nuestro vínculo.", reverse: false },

    // Trust (4 questions)
    { id: "q05", construct: "trust", text: "Puedo contar con que mi pareja cumplirá sus promesas.", reverse: false },
    { id: "q06", construct: "trust", text: "Confío en que mi pareja es honesta conmigo, incluso sobre cosas difíciles.", reverse: false },
    { id: "q07", construct: "trust", text: "Creo que mi pareja tiene mis mejores intereses en mente.", reverse: false },
    { id: "q08", construct: "trust", text: "A veces me pregunto si mi pareja está siendo completamente sincera conmigo.", reverse: true },

    // Communication (4 questions)
    { id: "q09", construct: "communication", text: "Mi pareja y yo podemos discutir nuestros problemas con calma y respeto.", reverse: false },
    { id: "q10", construct: "communication", text: "Me siento escuchado/a y comprendido/a cuando comparto mis sentimientos con mi pareja.", reverse: false },
    { id: "q11", construct: "communication", text: "Durante las discusiones, uno de nosotros tiende a retirarse o cerrarse.", reverse: true },
    { id: "q12", construct: "communication", text: "Evitamos hablar sobre temas que podrían causar conflicto.", reverse: true },

    // Attachment (4 questions)
    { id: "q13", construct: "attachment", text: "Me siento cómodo/a dependiendo de mi pareja cuando necesito apoyo.", reverse: false },
    { id: "q14", construct: "attachment", text: "Sé que mi pareja estará ahí para mí cuando la necesite.", reverse: false },
    { id: "q15", construct: "attachment", text: "Me resulta difícil permitirme depender completamente de mi pareja.", reverse: true },
    { id: "q16", construct: "attachment", text: "Prefiero no mostrarle a mi pareja cómo me siento en el fondo.", reverse: true },

    // Abandonment (4 questions)
    { id: "q17", construct: "abandonment", text: "Rara vez me preocupa que mi pareja quiera dejarme.", reverse: false },
    { id: "q18", construct: "abandonment", text: "A menudo necesito que mi pareja me asegure que realmente me ama.", reverse: true },
    { id: "q19", construct: "abandonment", text: "Tengo miedo de que mi pareja pierda interés en mí con el tiempo.", reverse: true },
    { id: "q20", construct: "abandonment", text: "Cuando mi pareja no está, me siento seguro/a sobre nuestra relación.", reverse: false },

    // Independence (4 questions)
    { id: "q21", construct: "independence", text: "Mantengo mis propios intereses y amistades fuera de nuestra relación.", reverse: false },
    { id: "q22", construct: "independence", text: "Puedo estar en desacuerdo con mi pareja sin sentir que amenaza nuestro vínculo.", reverse: false },
    { id: "q23", construct: "independence", text: "Tiendo a perder mi sentido de identidad cuando estoy en una relación.", reverse: true },
    { id: "q24", construct: "independence", text: "Mi estado de ánimo está muy influenciado por el estado de ánimo de mi pareja.", reverse: true },
];

export const LIKERT_OPTIONS = [
    { value: 1, label: "Muy en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "De acuerdo" },
    { value: 5, label: "Muy de acuerdo" },
];
