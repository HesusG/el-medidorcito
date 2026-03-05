/**
 * Prescriptive feedback data for Love Test v2.
 * Warm, empathetic tone — never clinical.
 */

// --- Feedback for Likert dimensions (6 dimensions x 3 levels) ---
export const DIMENSION_FEEDBACK = {
    emotional_security: {
        high: {
            positive: "Tienes una gran capacidad para sentirte seguro/a emocionalmente, incluso en momentos difíciles. Eso habla de la solidez de tu vínculo.",
            watchFor: "A veces la comodidad puede hacer que demos por sentado lo que sentimos. No olvides seguir nutriendo esa seguridad.",
            reflect: "¿Qué hace tu pareja que más te ayuda a sentirte emocionalmente seguro/a?",
        },
        medium: {
            positive: "Hay una base de seguridad emocional en tu relación que vale la pena reconocer y cuidar.",
            watchFor: "Los momentos de inseguridad no significan que algo esté mal — son oportunidades para comunicar lo que necesitas.",
            reflect: "¿En qué situaciones sientes que tu seguridad emocional se tambalea? ¿Se lo has compartido a tu pareja?",
        },
        low: {
            positive: "El hecho de que reconozcas esta área ya es un paso importante. Querer sentirte seguro/a significa que la relación te importa.",
            watchFor: "La inseguridad emocional prolongada puede llevarte a interpretar las acciones de tu pareja de forma negativa. Intenta verificar antes de asumir.",
            reflect: "¿Qué necesitarías de tu pareja para sentirte más seguro/a emocionalmente?",
        },
    },
    trust: {
        high: {
            positive: "La confianza que sientes es un pilar fundamental. Valorar la honestidad de tu pareja fortalece el vínculo cada día.",
            watchFor: "La confianza ciega no es lo mismo que la confianza sana. Sigue comunicándote abiertamente para mantenerla.",
            reflect: "¿Hay algún tema que evites mencionar por miedo a romper esa confianza?",
        },
        medium: {
            positive: "Tienes una confianza razonable en tu relación, lo cual es una base sólida para seguir construyendo.",
            watchFor: "Las pequeñas dudas no atendidas pueden crecer. Es mejor hablar de ellas antes de que se acumulen.",
            reflect: "¿Qué te ayudaría a confiar un poco más? ¿Se lo has dicho a tu pareja?",
        },
        low: {
            positive: "Reconocer que la confianza es un reto para ti muestra valentía. No estás solo/a en esto.",
            watchFor: "La desconfianza puede volverse una profecía autocumplida: si buscas evidencia de traición, tu mente la encontrará donde no existe.",
            reflect: "¿Esta desconfianza viene de experiencias pasadas o de algo específico en esta relación?",
        },
    },
    communication: {
        high: {
            positive: "Tienen una comunicación que muchas parejas envidiarían. Poder hablar con calma y respeto es un superpoder relacional.",
            watchFor: "Comunicarse bien no significa evitar temas difíciles. Asegúrate de que también puedan hablar de lo incómodo.",
            reflect: "¿Hay algún tema que aunque se comuniquen bien, sigan evitando?",
        },
        medium: {
            positive: "Su comunicación tiene buenos momentos. Identificar cuándo funciona mejor puede ayudarles a replicarlo.",
            watchFor: "Retirarse o cerrarse durante un conflicto es una señal de que alguien se siente abrumado/a, no de que no le importe.",
            reflect: "¿Cuándo fue la última vez que una conversación difícil terminó bien? ¿Qué hicieron diferente?",
        },
        low: {
            positive: "Querer mejorar la comunicación es el primer paso. Muchas parejas pasan por esto y salen fortalecidas.",
            watchFor: "Evitar los conflictos no los resuelve — los acumula. Buscar espacios seguros para hablar es clave.",
            reflect: "¿Qué pasaría si le dijeras a tu pareja exactamente cómo te sientes en este momento?",
        },
    },
    attachment: {
        high: {
            positive: "Te sientes cómodo/a dependiendo de tu pareja cuando lo necesitas. Eso refleja un apego seguro y saludable.",
            watchFor: "Depender sanamente no es lo mismo que necesitar. Asegúrate de mantener tu propia red de apoyo también.",
            reflect: "¿Qué tan fácil te resulta pedir ayuda a tu pareja vs. a otras personas cercanas?",
        },
        medium: {
            positive: "Hay una buena base de conexión. A veces cuesta abrirse del todo, y eso es completamente normal.",
            watchFor: "Si te cuesta mostrar vulnerabilidad, no es debilidad — probablemente es un mecanismo de protección que alguna vez te sirvió.",
            reflect: "¿Qué es lo que más te cuesta compartir emocionalmente con tu pareja?",
        },
        low: {
            positive: "Tu independencia emocional puede ser una fortaleza. El reto es encontrar el balance entre autonomía y conexión.",
            watchFor: "Mantener distancia emocional puede protegerte, pero también puede hacer que tu pareja se sienta excluida de tu mundo interior.",
            reflect: "¿Hay algo que te impida dejarte apoyar completamente por tu pareja?",
        },
    },
    abandonment: {
        high: {
            positive: "Te sientes tranquilo/a respecto a la estabilidad de tu relación. Esa paz interior se nota y beneficia a los dos.",
            watchFor: "A veces la seguridad total puede hacer que bajemos la guardia en el cuidado activo de la relación.",
            reflect: "¿Cómo demuestras a tu pareja que su presencia en tu vida no la das por sentada?",
        },
        medium: {
            positive: "Es normal tener momentos de inseguridad. Lo importante es cómo los manejas.",
            watchFor: "Necesitar reafirmación de vez en cuando es humano. Pero si se vuelve constante, vale la pena explorar de dónde viene esa necesidad.",
            reflect: "¿En qué momentos específicos sientes más miedo de perder a tu pareja?",
        },
        low: {
            positive: "El miedo al abandono probablemente significa que esta relación es muy importante para ti. Eso tiene mucho valor.",
            watchFor: "El miedo intenso al abandono puede llevarte a comportamientos que paradójicamente alejan a tu pareja (celos, control, demanda constante).",
            reflect: "¿Puedes identificar si este miedo es sobre tu pareja actual o sobre experiencias anteriores?",
        },
    },
    independence: {
        high: {
            positive: "Mantienes tu identidad dentro de la relación. Eso es señal de madurez emocional y fortalece el vínculo.",
            watchFor: "Ser independiente es valioso, pero asegúrate de que tu pareja no lo perciba como distanciamiento.",
            reflect: "¿Tu pareja sabe lo importante que es para ti mantener tu individualidad?",
        },
        medium: {
            positive: "Estás encontrando un balance entre ser tú y ser parte de un 'nosotros'. Eso es un proceso, no un destino.",
            watchFor: "Si tu estado de ánimo depende mucho del de tu pareja, es una señal de que podrías necesitar más espacios propios.",
            reflect: "¿Tienes actividades o relaciones que son solo tuyas y que te recargan?",
        },
        low: {
            positive: "Entregarte a la relación muestra compromiso. Pero cuidar de ti mismo/a no es egoísmo — es necesario.",
            watchFor: "Perder tu identidad en la relación puede generar resentimiento a largo plazo. Tu pareja se enamoró de quien eres, no de tu reflejo.",
            reflect: "¿Qué hacías antes de esta relación que te hacía feliz y que has dejado de hacer?",
        },
    },
};

// --- Feedback for scenario patterns (5 patterns x 3 levels) ---
export const PATTERN_FEEDBACK = {
    mind_reading: {
        high: {
            positive: "Tiendes a verificar antes de asumir lo que piensa tu pareja. Eso evita muchos malentendidos.",
            watchFor: "Incluso con buenas intenciones, a veces podemos asumir que ya sabemos lo que el otro piensa. Sigue preguntando.",
            reflect: "¿Recuerdas alguna vez que asumiste algo sobre tu pareja y resultó ser diferente?",
        },
        medium: {
            positive: "A veces asumes y a veces preguntas — lo importante es que eres capaz de hacer ambas cosas.",
            watchFor: "La lectura de mente es más común de lo que crees. 'Seguro está enojado/a conmigo' es una historia que tu mente inventa, no necesariamente la realidad.",
            reflect: "¿Qué tan seguido verificas tus suposiciones sobre lo que tu pareja piensa o siente?",
        },
        low: {
            positive: "Tomar las cosas de manera muy personal probablemente significa que la relación te importa mucho.",
            watchFor: "Asumir las intenciones de tu pareja sin verificar puede crear conflictos donde no los hay. Antes de reaccionar, pregunta.",
            reflect: "La próxima vez que pienses 'seguro está pensando que...', ¿podrías detenerte y preguntarle directamente?",
        },
    },
    personalization: {
        high: {
            positive: "Logras no tomarte todo de manera personal. Eso te permite responder en vez de reaccionar.",
            watchFor: "A veces lo que parece indiferencia tuya puede ser que genuinamente no notas cuando algo sí va dirigido a ti.",
            reflect: "¿Hay situaciones donde deberías tomarte las cosas un poco más en serio?",
        },
        medium: {
            positive: "Tienes la capacidad de separar lo personal de lo general, aunque no siempre es fácil.",
            watchFor: "Cuando tu pareja tiene un mal día, no necesariamente es por algo que tú hiciste. Darle espacio sin asumirlo como personal es clave.",
            reflect: "¿Qué te ayuda a recordar que el humor de tu pareja no siempre tiene que ver contigo?",
        },
        low: {
            positive: "Tu sensibilidad hacia tu pareja muestra lo conectado/a que estás. Eso es valioso.",
            watchFor: "Si todo lo que hace tu pareja lo filtras por 'qué tiene que ver conmigo', puedes terminar agotado/a y agotando la relación.",
            reflect: "¿Puedes pensar en tres explicaciones alternativas cuando sientes que algo es 'contra ti'?",
        },
    },
    reassurance_seeking: {
        high: {
            positive: "Te sientes seguro/a sin necesitar confirmación constante. Eso le da ligereza y aire a tu relación.",
            watchFor: "No necesitar reafirmación no significa que no debas darla. Tu pareja podría necesitar escuchar cómo te sientes.",
            reflect: "¿Con qué frecuencia le dices a tu pareja lo que sientes por ella/él sin que te lo pida?",
        },
        medium: {
            positive: "Buscar validación de vez en cuando es completamente humano y sano en una relación.",
            watchFor: "Si necesitas que tu pareja te diga 'todo está bien' con mucha frecuencia, vale la pena explorar qué hay detrás de esa necesidad.",
            reflect: "¿La validación que buscas es sobre la relación o sobre ti mismo/a?",
        },
        low: {
            positive: "Necesitar saber dónde estás parado/a es natural. No te juzgues por ello.",
            watchFor: "La búsqueda constante de validación puede crear un ciclo: pides seguridad → tu pareja se cansa → tú te sientes más inseguro/a → pides más.",
            reflect: "¿Qué necesitarías para sentirte seguro/a sin tener que preguntar?",
        },
    },
    catastrophizing: {
        high: {
            positive: "Manejas los cambios pequeños con calma. Eso aporta estabilidad emocional a tu relación.",
            watchFor: "Ser calmado/a es genial, pero asegúrate de no minimizar situaciones que sí requieren atención.",
            reflect: "¿Alguna vez tu calma ha sido confundida con indiferencia?",
        },
        medium: {
            positive: "A veces imaginas lo peor y a veces logras mantener la calma. Reconocer cuándo exageras es un gran paso.",
            watchFor: "Un mensaje sin responder no significa el fin de la relación. Tu mente puede ser muy creativa inventando escenarios que no existen.",
            reflect: "¿Cuántas veces lo que imaginaste como catastrófico terminó siendo algo menor?",
        },
        low: {
            positive: "Tu intensidad emocional muestra cuánto te importa. El reto es canalizarla sin que te consuma.",
            watchFor: "Imaginar lo peor ante cada cambio pequeño es agotador para ti y para tu pareja. Un cambio de tono no es una ruptura.",
            reflect: "Antes de escalar mentalmente, ¿puedes esperar 10 minutos y ver si la situación se resuelve sola?",
        },
    },
    emotional_sensitivity: {
        high: {
            positive: "Procesas las emociones con equilibrio. Eso te permite responder de forma constructiva ante las dificultades.",
            watchFor: "No todo necesita ser procesado con lógica. A veces está bien simplemente sentir.",
            reflect: "¿Tu pareja se siente libre de expresar emociones intensas contigo?",
        },
        medium: {
            positive: "Tienes reacciones emocionales normales que a veces son intensas y a veces son contenidas.",
            watchFor: "Las palabras de tu pareja pueden doler más de lo que ella imagina. Decirle qué te afecta (sin culpar) ayuda.",
            reflect: "¿Puedes identificar qué palabras o tonos específicos te activan emocionalmente?",
        },
        low: {
            positive: "Sentir las cosas intensamente es parte de ser una persona profundamente emocional. Eso no está mal.",
            watchFor: "La reactividad intensa puede hacer que tu pareja sienta que tiene que 'caminar sobre huevos'. Eso erosiona la naturalidad.",
            reflect: "¿Qué estrategia podrías usar para darte un momento antes de reaccionar cuando algo te duele?",
        },
    },
};

// --- Couple dynamics based on dominant style combinations ---
export const COUPLE_DYNAMICS = {
    "secure-secure": {
        title: "Conexión Equilibrada",
        message: "Ambos tienden a responder desde la seguridad. Esto crea un espacio donde pueden ser vulnerables sin miedo. Su reto es no caer en la complacencia.",
    },
    "secure-anxious": {
        title: "Ancla y Oleaje",
        message: "Uno aporta estabilidad mientras el otro trae intensidad emocional. El reto es que quien es más seguro no minimice las necesidades del otro, y que quien es más ansioso confíe en la calma.",
    },
    "secure-avoidant": {
        title: "Puente y Orilla",
        message: "Uno busca conexión activamente y el otro necesita espacio. Pueden complementarse si respetan los ritmos del otro: ni presionar ni desaparecer.",
    },
    "secure-reactive": {
        title: "Calma y Tormenta",
        message: "Uno responde con calma y el otro con intensidad. El que es más calmado puede ser un ancla estabilizadora, pero necesita no juzgar las reacciones del otro.",
    },
    "anxious-anxious": {
        title: "Dos Corazones Intensos",
        message: "Ambos sienten con mucha intensidad. Pueden entenderse profundamente pero también escalar conflictos rápidamente. Su reto es aprender a calmarse juntos, no solo sentir juntos.",
    },
    "anxious-avoidant": {
        title: "La Danza del Acercamiento",
        message: "Uno busca cercanía y el otro se aleja. Este es un patrón muy común y puede romperse: quien evita necesita dar pasos pequeños de acercamiento, y quien busca necesita dar espacio sin interpretarlo como rechazo.",
    },
    "anxious-reactive": {
        title: "Fuego Cruzado",
        message: "Uno busca validación y el otro responde con intensidad. Pueden aprender mucho si logran bajar la guardia: la vulnerabilidad detrás de cada reacción es la misma necesidad de ser amado/a.",
    },
    "avoidant-avoidant": {
        title: "Dos Islas Cercanas",
        message: "Ambos tienden a retirarse ante la incomodidad emocional. Su relación puede sentirse 'fácil' pero emocionalmente distante. El reto es acercarse intencionalmente.",
    },
    "avoidant-reactive": {
        title: "Hielo y Fuego",
        message: "Uno se cierra y el otro escala. Este patrón puede crear un ciclo difícil. La clave es que quien se cierra comunique que necesita tiempo (no que está rechazando) y que quien escala encuentre formas más suaves de expresar frustración.",
    },
    "reactive-reactive": {
        title: "Intensidad Compartida",
        message: "Ambos tienden a reaccionar con fuerza. Pueden tener discusiones muy intensas pero también reconciliaciones profundas. Su reto es aprender a pausar antes de que la escalada llegue demasiado lejos.",
    },
};

// --- Introspection prompts per scenario pattern ---
export const INTROSPECTION_PROMPTS = {
    mind_reading: [
        "¿Cuántas veces esta semana asumiste lo que tu pareja pensaba sin preguntarle?",
        "Si pudieras reemplazar 'seguro piensa que...' por una pregunta directa, ¿cuál sería?",
        "¿Qué es lo peor que podría pasar si preguntas en vez de asumir?",
    ],
    personalization: [
        "Cuando tu pareja tiene un mal día, ¿tu primer pensamiento es '¿qué hice yo?'",
        "¿Puedes recordar una vez que tomaste algo personal y resultó no tener nada que ver contigo?",
        "¿Qué pasaría si la próxima vez que sientas que algo va contra ti, simplemente preguntaras '¿todo bien?'",
    ],
    reassurance_seeking: [
        "¿Qué tan seguido necesitas escuchar 'todo está bien entre nosotros' para sentirte tranquilo/a?",
        "Si tu pareja no te dice 'te amo' un día, ¿automáticamente piensas que algo cambió?",
        "¿Qué señales de amor podrías aprender a reconocer que no sean palabras?",
    ],
    catastrophizing: [
        "¿Cuántas veces lo que imaginaste como catastrófico resultó ser algo menor?",
        "Cuando tu pareja cambia de tono, ¿tu mente va directo al peor escenario?",
        "¿Podrías esperar 24 horas antes de reaccionar a algo que te preocupa?",
    ],
    emotional_sensitivity: [
        "¿Hay palabras específicas de tu pareja que te activan emocionalmente más que otras?",
        "¿Puedes distinguir entre lo que tu pareja dijo y lo que tú interpretaste?",
        "¿Qué estrategia de 'pausa' podrías usar antes de reaccionar a algo que te duele?",
    ],
};
