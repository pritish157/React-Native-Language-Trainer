import { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  // ==========================================
  // ── SPANISH LESSONS (es-unit-1) ───────────
  // ==========================================
  {
    id: "es-u1-l1",
    unitId: "es-unit-1",
    title: "Spanish Greetings",
    description: "Meet your AI video/audio teacher and learn basic greetings in Spanish.",
    xpReward: 20,
    type: "video",
    goals: ["Learn to say hello", "Learn morning greetings", "Learn to say goodbye"],
    activities: [
      {
        id: "es-u1-l1-act1",
        type: "video_lecture",
        title: "AI Teacher Session",
        instructions: "Listen to the AI teacher explain basic greetings and repeat after them when prompted.",
        vocabularyItems: [
          {
            id: "es-voc-hola",
            word: "Hola",
            meaning: "Hello / Hi",
            pronunciation: "oh-lah",
            exampleSentence: "Hola, ¿cómo estás?",
            exampleTranslation: "Hello, how are you?",
          },
          {
            id: "es-voc-buenos-dias",
            word: "Buenos días",
            meaning: "Good morning",
            pronunciation: "bweh-nohs dee-ahs",
            exampleSentence: "Buenos días, mi amigo.",
            exampleTranslation: "Good morning, my friend.",
          },
          {
            id: "es-voc-adios",
            word: "Adiós",
            meaning: "Goodbye",
            pronunciation: "ah-dyohs",
            exampleSentence: "Adiós, nos vemos mañana.",
            exampleTranslation: "Goodbye, see you tomorrow.",
          },
        ],
        aiTeacherPrompt: 
          "You are Sofia, a friendly Spanish AI language teacher. " +
          "Your goal is to teach the user three basic greetings: 'Hola', 'Buenos días', and 'Adiós'. " +
          "Begin with a warm greeting: '¡Hola! Welcome to your first Spanish lesson. I am Sofia, your AI teacher.' " +
          "Explain each word clearly, pronounce it slowly twice, and ask the user to repeat it. " +
          "Wait for them to repeat. If they pronounce it well, give enthusiastic positive feedback! " +
          "If they struggle, gently correct them. End the session by congratulating them and saying '¡Adiós!'",
      },
      {
        id: "es-u1-l1-act2",
        type: "phrase_matching",
        title: "Match the Greetings",
        instructions: "Select the correct translation for the Spanish greetings.",
        phrases: [
          {
            id: "es-phr-hola",
            phrase: "Hola",
            meaning: "Hello",
            pronunciation: "oh-lah",
          },
          {
            id: "es-phr-buenos-dias",
            phrase: "Buenos días",
            meaning: "Good morning",
            pronunciation: "bweh-nohs dee-ahs",
          },
        ],
      },
    ],
  },
  {
    id: "es-u1-l2",
    unitId: "es-unit-1",
    title: "Introductions",
    description: "Learn to introduce yourself and have a simple conversation with your AI Tutor.",
    xpReward: 25,
    type: "chat",
    goals: ["Introduce your name", "Ask for someone's name", "Say nice to meet you"],
    activities: [
      {
        id: "es-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Chat with AI Tutor",
        instructions: "Have a short conversation with Carlos. Introduce yourself and ask him his name.",
        phrases: [
          {
            id: "es-phr-me-llamo",
            phrase: "Me llamo...",
            meaning: "My name is...",
            pronunciation: "meh yah-moh",
            context: "Used to introduce yourself",
          },
          {
            id: "es-phr-como-te-llamas",
            phrase: "¿Cómo te llamas?",
            meaning: "What is your name?",
            pronunciation: "coh-moh teh yah-mahs",
            context: "Used to ask someone's name",
          },
          {
            id: "es-phr-mucho-gusto",
            phrase: "Mucho gusto",
            meaning: "Nice to meet you",
            pronunciation: "moo-choh goos-toh",
            context: "Polite response after meeting someone",
          },
        ],
        aiTutorPrompt:
          "You are Carlos, a helpful and patient AI tutor. " +
          "The user is a beginner learning Spanish. Start a friendly chat by saying: '¡Hola! ¿Cómo te llamas?' " +
          "Guide the user to respond with 'Me llamo [Name]'. " +
          "Once they introduce themselves, respond with 'Mucho gusto, [Name]' and ask them how they are doing. " +
          "Keep your responses short, simple, and encouraging. Correct any minor spelling mistakes politely.",
      },
    ],
  },
  {
    id: "es-u1-l3",
    unitId: "es-unit-1",
    title: "Food & Drinks Basics",
    description: "Practice key vocabulary for common foods and beverages.",
    xpReward: 15,
    type: "interactive",
    goals: ["Identify daily food items", "Recognize common drinks"],
    activities: [
      {
        id: "es-u1-l3-act1",
        type: "vocabulary_quiz",
        title: "Drinks Identification",
        instructions: "What does 'el café' mean?",
        vocabularyItems: [
          {
            id: "es-voc-cafe",
            word: "El café",
            meaning: "Coffee",
          },
          {
            id: "es-voc-agua",
            word: "El agua",
            meaning: "Water",
          },
        ],
        multipleChoiceOptions: [
          { id: "opt-1", text: "Milk", isCorrect: false },
          { id: "opt-2", text: "Coffee", isCorrect: true },
          { id: "opt-3", text: "Tea", isCorrect: false },
        ],
        correctAnswer: "Coffee",
      },
      {
        id: "es-u1-l3-act2",
        type: "vocabulary_quiz",
        title: "Food Identification",
        instructions: "What does 'el pan' mean?",
        vocabularyItems: [
          {
            id: "es-voc-pan",
            word: "El pan",
            meaning: "Bread",
          },
        ],
        multipleChoiceOptions: [
          { id: "opt-a", text: "Cheese", isCorrect: false },
          { id: "opt-b", text: "Bread", isCorrect: true },
          { id: "opt-c", text: "Apple", isCorrect: false },
        ],
        correctAnswer: "Bread",
      },
    ],
  },

  // ==========================================
  // ── FRENCH LESSONS (fr-unit-1) ────────────
  // ==========================================
  {
    id: "fr-u1-l1",
    unitId: "fr-unit-1",
    title: "French Basics",
    description: "Learn essential French greetings and courtesy words with your AI teacher.",
    xpReward: 20,
    type: "video",
    goals: ["Say hello formally and informally", "Say goodbye", "Thank someone"],
    activities: [
      {
        id: "fr-u1-l1-act1",
        type: "video_lecture",
        title: "AI Teacher Session",
        instructions: "Listen to the AI teacher speak and practice greeting them.",
        vocabularyItems: [
          {
            id: "fr-voc-bonjour",
            word: "Bonjour",
            meaning: "Hello / Good morning",
            pronunciation: "bohn-zhoor",
            exampleSentence: "Bonjour, madame.",
            exampleTranslation: "Hello, ma'am.",
          },
          {
            id: "fr-voc-salut",
            word: "Salut",
            meaning: "Hi / Bye (informal)",
            pronunciation: "sah-loo",
            exampleSentence: "Salut, ça va?",
            exampleTranslation: "Hi, how's it going?",
          },
          {
            id: "fr-voc-merci",
            word: "Merci",
            meaning: "Thank you",
            pronunciation: "mair-see",
            exampleSentence: "Merci beaucoup.",
            exampleTranslation: "Thank you very much.",
          },
        ],
        aiTeacherPrompt:
          "You are Chloé, a warm and encouraging French AI language teacher. " +
          "Your goal is to teach the user 'Bonjour', 'Salut', and 'Merci'. " +
          "Begin with: 'Bonjour! Welcome to your first French lesson. I am Chloé.' " +
          "Explain the difference between 'Bonjour' (formal) and 'Salut' (informal). " +
          "Ask the user to say 'Bonjour' and wait for them to respond. " +
          "Offer pronunciation correction if they don't say the 'R' or 'on' sounds correctly. " +
          "End the lesson with 'Merci' and tell them they did a wonderful job.",
      },
    ],
  },
];

/**
 * Helper to get lessons by unit
 */
export const getLessonsByUnit = (unitId: string): Lesson[] => {
  return lessons.filter((lesson) => lesson.unitId === unitId);
};
