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

// --- Scenario patterns (v2) ---

export const SCENARIO_PATTERNS = [
    {
        id: "mind_reading",
        name: "Lectura de Mente",
        icon: "Brain",
        color: "bg-indigo-200",
        description: "Tendencia a asumir lo que tu pareja piensa o siente sin verificarlo.",
    },
    {
        id: "personalization",
        name: "Personalización",
        icon: "Target",
        color: "bg-orange-200",
        description: "Tendencia a tomar las acciones o estados de ánimo de tu pareja como algo personal.",
    },
    {
        id: "reassurance_seeking",
        name: "Búsqueda de Validación",
        icon: "MessageSquareHeart",
        color: "bg-cyan-200",
        description: "Necesidad de confirmación constante sobre la relación o los sentimientos de tu pareja.",
    },
    {
        id: "catastrophizing",
        name: "Catastrofización",
        icon: "CloudLightning",
        color: "bg-amber-200",
        description: "Tendencia a imaginar el peor escenario ante cambios pequeños en la relación.",
    },
    {
        id: "emotional_sensitivity",
        name: "Sensibilidad Emocional",
        icon: "Flame",
        color: "bg-rose-200",
        description: "Reactividad intensa ante palabras, tonos o acciones de tu pareja.",
    },
];

export const RESPONSE_STYLES = {
    secure: { name: "Seguro", description: "Respuestas equilibradas, comunicativas y empáticas.", color: "bg-green-400" },
    anxious: { name: "Ansioso", description: "Búsqueda de validación, inseguridad, necesidad de cercanía.", color: "bg-blue-400" },
    avoidant: { name: "Evitativo", description: "Retirarse, cerrarse, buscar distancia emocional.", color: "bg-gray-400" },
    reactive: { name: "Reactivo", description: "Respuestas intensas, pasivo-agresivas o escaladoras.", color: "bg-red-400" },
};

export const SCENARIOS = [
    // --- Mind Reading (4) ---
    {
        id: "s01",
        pattern: "mind_reading",
        text: "Llegas a casa y tu pareja apenas te saluda. Parece distraída con su teléfono.",
        options: [
            { label: "Le pregunto cómo estuvo su día y si todo está bien", style: "secure", score: 4 },
            { label: "Pienso que seguro está enojada conmigo por algo", style: "anxious", score: 1 },
            { label: "Agarro mi teléfono también y no digo nada", style: "avoidant", score: 2 },
            { label: "Le digo con ironía 'Qué bonito recibimiento'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s02",
        pattern: "mind_reading",
        text: "Tu pareja suspira profundamente mientras revisa su teléfono. No te ha dicho nada.",
        options: [
            { label: "Le pregunto '¿pasó algo?' con calma", style: "secure", score: 4 },
            { label: "Asumo que está molesta conmigo y empiezo a repasar qué pude haber hecho", style: "anxious", score: 1 },
            { label: "Lo ignoro, si quiere decirme algo lo hará", style: "avoidant", score: 2 },
            { label: "Le digo '¿Y ahora qué te pasa?' en tono cansado", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s03",
        pattern: "mind_reading",
        text: "Tu pareja está más callada de lo normal durante la cena.",
        options: [
            { label: "Le pregunto directamente si hay algo que la preocupe", style: "secure", score: 4 },
            { label: "Empiezo a pensar que hice algo malo y me pongo nervioso/a", style: "anxious", score: 1 },
            { label: "Sigo comiendo normal, cada quien tiene sus momentos", style: "avoidant", score: 2 },
            { label: "Le digo '¿Me vas a ignorar toda la noche?'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s04",
        pattern: "mind_reading",
        text: "Le mandas un meme a tu pareja y solo responde con un 'jaja'. Normalmente responde con más entusiasmo.",
        options: [
            { label: "Pienso que tal vez está ocupada y no le doy más vueltas", style: "secure", score: 4 },
            { label: "Me pregunto si le caí mal o si la aburrí", style: "anxious", score: 1 },
            { label: "Dejo de mandar memes por un rato", style: "avoidant", score: 2 },
            { label: "Le escribo '¿Ya ni te causan gracia mis cosas?'", style: "reactive", score: 1.5 },
        ],
    },

    // --- Personalization (4) ---
    {
        id: "s05",
        pattern: "personalization",
        text: "Tu pareja llega de mal humor del trabajo y responde cortante a una pregunta tuya.",
        options: [
            { label: "Entiendo que tuvo un mal día y le doy un momento para descomprimirse", style: "secure", score: 4 },
            { label: "Siento que la tomó conmigo y me pregunto qué hice", style: "anxious", score: 1 },
            { label: "Me voy a otro cuarto para no lidiar con su humor", style: "avoidant", score: 2 },
            { label: "Le digo '¿Y yo qué te hice? No soy tu saco de boxeo'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s06",
        pattern: "personalization",
        text: "Tu pareja publica una historia en redes pero no le da like a tu última foto.",
        options: [
            { label: "No le doy importancia, seguramente no la vio", style: "secure", score: 4 },
            { label: "Me siento ignorado/a y reviso si le dio like a otras personas", style: "anxious", score: 1 },
            { label: "Decido no darle like a sus cosas tampoco", style: "avoidant", score: 2 },
            { label: "Le mando un mensaje tipo '¿Ya no te gustan mis fotos o qué?'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s07",
        pattern: "personalization",
        text: "Tu pareja le cuenta a un amigo algo importante antes de contártelo a ti.",
        options: [
            { label: "Entiendo que a veces necesita otros puntos de vista y no significa que me excluya", style: "secure", score: 4 },
            { label: "Me siento herido/a porque debería ser la primera persona en enterarme", style: "anxious", score: 1 },
            { label: "No digo nada pero internamente me distancio un poco", style: "avoidant", score: 2 },
            { label: "Le reclamo '¿Por qué tu amigo se entera antes que yo?'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s08",
        pattern: "personalization",
        text: "Tu pareja dice que necesita un fin de semana para ella/él solo/a.",
        options: [
            { label: "Me parece sano, yo también aprovecho para hacer mis cosas", style: "secure", score: 4 },
            { label: "Me pregunto si ya se cansó de mí o si quiere estar con alguien más", style: "anxious", score: 1 },
            { label: "Digo que está bien aunque por dentro me molesta un poco", style: "avoidant", score: 2 },
            { label: "Le digo '¿O sea que te estorbo?'", style: "reactive", score: 1.5 },
        ],
    },

    // --- Reassurance Seeking (4) ---
    {
        id: "s09",
        pattern: "reassurance_seeking",
        text: "Tu pareja no te dice 'te amo' al despedirse como usualmente hace.",
        options: [
            { label: "No le doy importancia, sé que me quiere aunque no lo diga siempre", style: "secure", score: 4 },
            { label: "Le mando un mensaje preguntando '¿está todo bien entre nosotros?'", style: "anxious", score: 1 },
            { label: "Yo tampoco lo digo la próxima vez", style: "avoidant", score: 2 },
            { label: "Le digo '¿Ya no me quieres o qué?' medio en broma medio en serio", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s10",
        pattern: "reassurance_seeking",
        text: "Ves que tu pareja comenta con un emoji de corazón la foto de alguien atractivo/a.",
        options: [
            { label: "No me preocupa, un emoji no significa nada y confío en nuestra relación", style: "secure", score: 4 },
            { label: "Le pregunto quién es esa persona y si le parece atractiva", style: "anxious", score: 1 },
            { label: "Lo noto pero no digo nada para no parecer celoso/a", style: "avoidant", score: 2 },
            { label: "Comento la foto de alguien atractivo/a también para ver su reacción", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s11",
        pattern: "reassurance_seeking",
        text: "Llevan unos días sin tener una conversación profunda. Solo cosas logísticas.",
        options: [
            { label: "Propongo una noche sin distracciones para reconectarnos", style: "secure", score: 4 },
            { label: "Le pregunto si sigue sintiendo lo mismo por mí", style: "anxious", score: 1 },
            { label: "No digo nada, las relaciones tienen ciclos", style: "avoidant", score: 2 },
            { label: "Le digo '¿Ya somos roommates o qué?'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s12",
        pattern: "reassurance_seeking",
        text: "Tu pareja va a una fiesta sin ti y no te escribe en toda la noche.",
        options: [
            { label: "Confío en que se está divirtiendo y me contará mañana", style: "secure", score: 4 },
            { label: "Le mando varios mensajes para saber cómo está y con quién anda", style: "anxious", score: 1 },
            { label: "Finjo que no me importa aunque estoy pendiente del teléfono", style: "avoidant", score: 2 },
            { label: "Cuando llega le digo '¿Tan difícil era mandar un mensaje?'", style: "reactive", score: 1.5 },
        ],
    },

    // --- Catastrophizing (4) ---
    {
        id: "s13",
        pattern: "catastrophizing",
        text: "Tu pareja cancela una cena porque le surgió algo del trabajo.",
        options: [
            { label: "Propongo reagendar y le deseo éxito con lo del trabajo", style: "secure", score: 4 },
            { label: "Siento que el trabajo siempre será más importante que yo", style: "anxious", score: 1 },
            { label: "Digo que está bien pero no propongo otra fecha", style: "avoidant", score: 2 },
            { label: "Le digo 'Nunca soy tu prioridad'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s14",
        pattern: "catastrophizing",
        text: "Tu pareja menciona que una compañera de trabajo es 'muy divertida'.",
        options: [
            { label: "Me da gusto que tenga buena relación con sus colegas", style: "secure", score: 4 },
            { label: "Empiezo a preocuparme de que le guste esa persona", style: "anxious", score: 1 },
            { label: "Cambio de tema sin mostrar lo que sentí", style: "avoidant", score: 2 },
            { label: "Le digo '¿Y yo no soy divertida/o?' con tono ácido", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s15",
        pattern: "catastrophizing",
        text: "Tu pareja te dice que necesita 'hablar de algo' pero no puede ahora, que luego.",
        options: [
            { label: "Le digo que cuando esté lista/o la escucho con gusto", style: "secure", score: 4 },
            { label: "Paso las siguientes horas imaginando que me va a dejar", style: "anxious", score: 1 },
            { label: "Digo 'ok' y trato de no pensar en ello", style: "avoidant", score: 2 },
            { label: "Le digo 'Dime ahorita, no me dejes así'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s16",
        pattern: "catastrophizing",
        text: "Notas que tu pareja cambió su foto de perfil y ya no apareces tú en ella.",
        options: [
            { label: "Es solo una foto, no cambia lo que somos", style: "secure", score: 4 },
            { label: "Siento que es una señal de que se está alejando de mí", style: "anxious", score: 1 },
            { label: "Cambio la mía también sin decir nada", style: "avoidant", score: 2 },
            { label: "Le pregunto molesto/a '¿Ya me borraste de tu vida?'", style: "reactive", score: 1.5 },
        ],
    },

    // --- Emotional Sensitivity (4) ---
    {
        id: "s17",
        pattern: "emotional_sensitivity",
        text: "Tu pareja te dice en tono directo: 'No me gustó lo que dijiste en la cena con mis amigos'.",
        options: [
            { label: "Le pregunto qué específicamente le molestó para entender y no repetirlo", style: "secure", score: 4 },
            { label: "Me siento atacado/a y me cierro emocionalmente", style: "anxious", score: 1 },
            { label: "Le digo 'Ok' y me quedo en silencio el resto de la noche", style: "avoidant", score: 2 },
            { label: "Le contesto '¿Y lo que tú dices siempre está perfecto?'", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s18",
        pattern: "emotional_sensitivity",
        text: "Tu pareja hace un chiste sobre algo que a ti te importa mucho.",
        options: [
            { label: "Le digo con calma que eso me importa y prefiero que no bromee con ello", style: "secure", score: 4 },
            { label: "Me quedo callado/a pero me siento herido/a por dentro", style: "anxious", score: 1 },
            { label: "Finjo que me río para no hacer un drama", style: "avoidant", score: 2 },
            { label: "Le contesto con otro chiste hiriente para que sienta lo mismo", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s19",
        pattern: "emotional_sensitivity",
        text: "Durante una discusión, tu pareja sube el tono de voz sin darse cuenta.",
        options: [
            { label: "Le pido que bajemos el tono para poder escucharnos mejor", style: "secure", score: 4 },
            { label: "Me paralizo y siento que la situación se salió de control", style: "anxious", score: 1 },
            { label: "Me callo y espero a que se calme, aunque me afecte", style: "avoidant", score: 2 },
            { label: "Subo mi tono también: si grita, yo grito", style: "reactive", score: 1.5 },
        ],
    },
    {
        id: "s20",
        pattern: "emotional_sensitivity",
        text: "Tu pareja te dice que algo que cocinaste 'no le quedó tan bien como la vez pasada'.",
        options: [
            { label: "Le pregunto qué le gustaría diferente para la próxima", style: "secure", score: 4 },
            { label: "Siento que nada de lo que hago es suficiente", style: "anxious", score: 1 },
            { label: "Digo 'Ok' y decido no cocinar en un buen rato", style: "avoidant", score: 2 },
            { label: "Le digo 'Pues cocina tú la próxima vez'", style: "reactive", score: 1.5 },
        ],
    },
];
