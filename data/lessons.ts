import { Lesson } from "@/types/learning";
import { images } from "@/constants/images";

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
  {
    id: "fr-u1-l2",
    unitId: "fr-unit-1",
    title: "French Introductions",
    description: "Introduce yourself to Chloe and learn how to ask 'what is your name' in French.",
    xpReward: 25,
    type: "chat",
    goals: ["Introduce your name", "Ask for someone's name", "Say nice to meet you"],
    activities: [
      {
        id: "fr-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Chat with AI Tutor",
        instructions: "Have a friendly conversation with Pierre. Tell him your name and ask how he is.",
        phrases: [
          {
            id: "fr-phr-je-m-appelle",
            phrase: "Je m'appelle...",
            meaning: "My name is...",
            pronunciation: "zhuh mah-pell",
          },
          {
            id: "fr-phr-comment-t-appelles-tu",
            phrase: "Comment t'appelles-tu ?",
            meaning: "What is your name?",
            pronunciation: "koh-mah tah-pell too",
          },
        ],
        aiTutorPrompt:
          "You are Pierre, a helpful and patient French tutor. " +
          "Start a friendly chat by greeting the user and asking their name.",
      },
    ],
  },
  {
    id: "fr-u1-l3",
    unitId: "fr-unit-1",
    title: "At the Bistro",
    description: "Learn how to order a croissant and a café in a typical French bistro.",
    xpReward: 20,
    type: "video",
    goals: ["Order coffee and pastries", "Polite restaurant phrases"],
    activities: [
      {
        id: "fr-u1-l3-act1",
        type: "video_lecture",
        title: "Ordering at a Bistro",
        instructions: "Learn key food terms and practice ordering them politely.",
        vocabularyItems: [
          {
            id: "fr-voc-cafe",
            word: "Un café",
            meaning: "A coffee",
          },
          {
            id: "fr-voc-croissant",
            word: "Un croissant",
            meaning: "A croissant",
          },
          {
            id: "fr-voc-s-il-vous-plait",
            word: "S'il vous plaît",
            meaning: "Please (formal)",
          },
        ],
      },
    ],
  },
  {
    id: "fr-u1-l4",
    unitId: "fr-unit-1",
    title: "Travel & Directions",
    description: "Learn essential navigation terms like 'where is the metro' in French.",
    xpReward: 15,
    type: "interactive",
    goals: ["Ask for directions", "Understand basic travel vocabulary"],
    activities: [
      {
        id: "fr-u1-l4-act1",
        type: "vocabulary_quiz",
        title: "Directions Quiz",
        instructions: "What does 'où est le métro' mean?",
        correctAnswer: "Where is the metro",
        multipleChoiceOptions: [
          { id: "fr-opt-1", text: "Where is the cafe", isCorrect: false },
          { id: "fr-opt-2", text: "Where is the metro", isCorrect: true },
          { id: "fr-opt-3", text: "Where is the hotel", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "fr-u1-l5",
    unitId: "fr-unit-1",
    title: "Shopping",
    description: "Practice shopping terms and ask 'how much does it cost' in French.",
    xpReward: 25,
    type: "chat",
    goals: ["Ask for prices", "Basic shopping conversation"],
    activities: [
      {
        id: "fr-u1-l5-act1",
        type: "ai_tutor_chat",
        title: "Boutique Shopping",
        instructions: "Chat with the boutique assistant. Ask for the price of a souvenir.",
        aiTutorPrompt: "You are a friendly boutique salesperson. Ask the customer how you can help them.",
      },
    ],
  },
  {
    id: "fr-u1-l6",
    unitId: "fr-unit-1",
    title: "Family & Friends",
    description: "Learn how to describe family members and friends in French.",
    xpReward: 15,
    type: "interactive",
    goals: ["Describe family members", "Basic family terms"],
    activities: [
      {
        id: "fr-u1-l6-act1",
        type: "vocabulary_quiz",
        title: "Family Quiz",
        instructions: "What does 'la famille' mean?",
        correctAnswer: "The family",
        multipleChoiceOptions: [
          { id: "fr-fam-1", text: "The friend", isCorrect: false },
          { id: "fr-fam-2", text: "The family", isCorrect: true },
          { id: "fr-fam-3", text: "The mother", isCorrect: false },
        ],
      },
    ],
  },

  // ==========================================
  // ── SPANISH LESSONS (es-unit-3) ───────────
  // ==========================================
  {
    id: "es-u3-l1",
    unitId: "es-unit-3",
    title: "Greetings & Introductions",
    description: "Master greetings and introductions in a casual café environment.",
    xpReward: 20,
    type: "video",
    goals: ["Greet friends casually", "Introduce a new friend"],
    activities: [
      {
        id: "es-u3-l1-act1",
        type: "video_lecture",
        title: "Greetings Session",
        instructions: "Listen to Sofia explain casual greetings and practice repeating.",
        vocabularyItems: [
          { id: "es-v3-1", word: "¿Qué tal?", meaning: "What's up? / How's it going?" },
          { id: "es-v3-2", word: "Este es mi amigo", meaning: "This is my friend" },
        ],
      },
    ],
  },
  {
    id: "es-u3-l2",
    unitId: "es-unit-3",
    title: "Daily Life",
    description: "Talk about your daily routines and hobbies in Spanish.",
    xpReward: 25,
    type: "chat",
    goals: ["Discuss daily routines", "Express simple hobbies"],
    activities: [
      {
        id: "es-u3-l2-act1",
        type: "ai_tutor_chat",
        title: "Chatting about Daily Life",
        instructions: "Talk with Carlos about what you do in the morning and evening.",
        aiTutorPrompt: "You are Carlos. Ask the user about their daily activities and what they do in their free time.",
      },
    ],
  },
  {
    id: "es-u3-l3",
    unitId: "es-unit-3",
    title: "At the Café",
    description: "Practice ordering coffee, pastries, and having a light social chat.",
    xpReward: 20,
    type: "video",
    goals: ["Order coffee and a snack", "Ask for the bill in a café"],
    activities: [
      {
        id: "es-u3-l3-act1",
        type: "video_lecture",
        title: "Café Vocabulary",
        instructions: "Practice key phrases for ordering coffee and paying at the café.",
        vocabularyItems: [
          { id: "es-v3-cafe", word: "Un café con leche", meaning: "Coffee with milk" },
          { id: "es-v3-cuenta", word: "La cuenta, por favor", meaning: "The bill, please" },
        ],
      },
    ],
  },
  {
    id: "es-u3-l4",
    unitId: "es-unit-3",
    title: "Travel & Directions",
    description: "Ask for directions and find your way to popular landmarks.",
    xpReward: 15,
    type: "interactive",
    goals: ["Ask for directions", "Understand simple landmarks"],
    activities: [
      {
        id: "es-u3-l4-act1",
        type: "vocabulary_quiz",
        title: "Directions Quiz",
        instructions: "What does '¿Dónde está el museo?' mean?",
        correctAnswer: "Where is the museum",
        multipleChoiceOptions: [
          { id: "es-opt-31", text: "Where is the beach", isCorrect: false },
          { id: "es-opt-32", text: "Where is the museum", isCorrect: true },
          { id: "es-opt-33", text: "Where is the street", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "es-u3-l5",
    unitId: "es-unit-3",
    title: "Shopping",
    description: "Learn how to ask for prices and buy clothes in Spanish.",
    xpReward: 25,
    type: "chat",
    goals: ["Ask for clothing prices", "Express item sizes"],
    activities: [
      {
        id: "es-u3-l5-act1",
        type: "ai_tutor_chat",
        title: "Shopping Chat",
        instructions: "Ask the vendor for the price and sizes of a red t-shirt.",
        aiTutorPrompt: "You are a market vendor. Ask the customer what they are looking to buy today.",
      },
    ],
  },
  {
    id: "es-u3-l6",
    unitId: "es-unit-3",
    title: "Family & Friends",
    description: "Talk about your family relationships and introduce your relatives.",
    xpReward: 15,
    type: "interactive",
    goals: ["Talk about family relations", "Basic family roles"],
    image: images.studentPreview,
    activities: [
      {
        id: "es-u3-l6-act1",
        type: "vocabulary_quiz",
        title: "Family Vocab",
        instructions: "What does 'mis padres' mean?",
        correctAnswer: "my parents",
        multipleChoiceOptions: [
          { id: "es-opt-fam1", text: "my siblings", isCorrect: false },
          { id: "es-opt-fam2", text: "my parents", isCorrect: true },
          { id: "es-opt-fam3", text: "my grandparents", isCorrect: false },
        ],
      },
    ],
  },

  // ==========================================
  // ── JAPANESE LESSONS (ja-unit-1) ───────────
  // ==========================================
  {
    id: "ja-u1-l1",
    unitId: "ja-unit-1",
    title: "Japanese Greetings",
    description: "Learn to say Hello and basic greetings in Japanese.",
    xpReward: 20,
    type: "video",
    goals: ["Learn Konnichiwa", "Learn morning greetings"],
    image: images.mascotFoxTeacher,
    activities: [
      {
        id: "ja-u1-l1-act1",
        type: "video_lecture",
        title: "AI Teacher Greetings",
        instructions: "Practice saying Konnichiwa with the AI teacher.",
        vocabularyItems: [
          { id: "ja-voc-1", word: "こんにちは (Konnichiwa)", meaning: "Hello / Good afternoon" }
        ]
      }
    ]
  },
  {
    id: "ja-u1-l2",
    unitId: "ja-unit-1",
    title: "Self Introductions",
    description: "Introduce yourself to Carlos in Japanese.",
    xpReward: 25,
    type: "chat",
    goals: ["Say your name", "Nice to meet you"],
    image: images.streakFire,
    activities: [
      {
        id: "ja-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Introduction Chat",
        instructions: "Introduce your name to the tutor.",
        phrases: [
          { id: "ja-phr-1", phrase: "はじめまして (Hajimemashite)", meaning: "Nice to meet you" }
        ]
      }
    ]
  },
  {
    id: "ja-u1-l3",
    unitId: "ja-unit-1",
    title: "At the Café",
    description: "Order Green Tea and Water in Japanese.",
    xpReward: 15,
    type: "interactive",
    goals: ["Order tea", "Learn water vocabulary"],
    image: images.cafeTable,
    activities: [
      {
        id: "ja-u1-l3-act1",
        type: "vocabulary_quiz",
        title: "Drink Quiz",
        instructions: "What does 'お茶 (Ocha)' mean?",
        correctAnswer: "Green Tea",
        multipleChoiceOptions: [
          { id: "ja-opt-1", text: "Coffee", isCorrect: false },
          { id: "ja-opt-2", text: "Green Tea", isCorrect: true },
          { id: "ja-opt-3", text: "Water", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "ja-u1-l4",
    unitId: "ja-unit-1",
    title: "Tokyo Directions",
    description: "Ask how to find the metro station in Tokyo.",
    xpReward: 20,
    type: "video",
    goals: ["Ask for metro directions"],
    image: { uri: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=150&auto=format&fit=crop" },
    activities: [
      {
        id: "ja-u1-l4-act1",
        type: "video_lecture",
        title: "Metro Directions",
        instructions: "Listen and repeat the directions."
      }
    ]
  },
  {
    id: "ja-u1-l5",
    unitId: "ja-unit-1",
    title: "Shopping & Prices",
    description: "Ask how much items cost in Japanese.",
    xpReward: 25,
    type: "chat",
    goals: ["Ask for prices"],
    image: images.treasure,
    activities: [
      {
        id: "ja-u1-l5-act1",
        type: "ai_tutor_chat",
        title: "Shopping Chat",
        instructions: "Chat with the merchant."
      }
    ]
  },

  // ==========================================
  // ── KOREAN LESSONS (ko-unit-1) ─────────────
  // ==========================================
  {
    id: "ko-u1-l1",
    unitId: "ko-unit-1",
    title: "Korean Greetings",
    description: "Learn to say Hello and show politeness in Korean.",
    xpReward: 20,
    type: "video",
    goals: ["Learn Annyeonghaseyo", "Polite bow basics"],
    image: images.mascotFoxTeacher,
    activities: [
      {
        id: "ko-u1-l1-act1",
        type: "video_lecture",
        title: "Korean Teacher Greetings",
        instructions: "Practice saying Annyeonghaseyo.",
        vocabularyItems: [
          { id: "ko-voc-1", word: "안녕하세요 (Annyeonghaseyo)", meaning: "Hello" }
        ]
      }
    ]
  },
  {
    id: "ko-u1-l2",
    unitId: "ko-unit-1",
    title: "Introductions",
    description: "Introduce your name in Korean.",
    xpReward: 25,
    type: "chat",
    goals: ["Say your name", "Ask other's name"],
    image: images.streakFire,
    activities: [
      {
        id: "ko-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Name Chat",
        instructions: "Tell Carlos your name in Korean."
      }
    ]
  },
  {
    id: "ko-u1-l3",
    unitId: "ko-unit-1",
    title: "Korean Food Basics",
    description: "Learn essential Korean food terms like Kimchi.",
    xpReward: 15,
    type: "interactive",
    goals: ["Identify Korean dishes"],
    image: images.cafeTable,
    activities: [
      {
        id: "ko-u1-l3-act1",
        type: "vocabulary_quiz",
        title: "Food Identification",
        instructions: "What does '김치 (Kimchi)' mean?",
        correctAnswer: "Kimchi",
        multipleChoiceOptions: [
          { id: "ko-opt-1", text: "Rice", isCorrect: false },
          { id: "ko-opt-2", text: "Kimchi", isCorrect: true },
          { id: "ko-opt-3", text: "Tea", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "ko-u1-l4",
    unitId: "ko-unit-1",
    title: "Seoul Directions",
    description: "Navigate around the streets of Seoul.",
    xpReward: 20,
    type: "video",
    goals: ["Ask where the subway is"],
    image: { uri: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop" },
    activities: [
      {
        id: "ko-u1-l4-act1",
        type: "video_lecture",
        title: "Subway Directions",
        instructions: "Learn to ask for the subway station."
      }
    ]
  },
  {
    id: "ko-u1-l5",
    unitId: "ko-unit-1",
    title: "Myeongdong Shopping",
    description: "Shop for skincare and products in Seoul.",
    xpReward: 25,
    type: "chat",
    goals: ["Inquire about skincare prices"],
    image: images.treasure,
    activities: [
      {
        id: "ko-u1-l5-act1",
        type: "ai_tutor_chat",
        title: "Skincare Shop",
        instructions: "Practice buying skincare products."
      }
    ]
  },

  // ==========================================
  // ── GERMAN LESSONS (de-unit-1) ─────────────
  // ==========================================
  {
    id: "de-u1-l1",
    unitId: "de-unit-1",
    title: "German Greetings",
    description: "Learn Hallo, Guten Morgen, and polite greetings in German.",
    xpReward: 20,
    type: "video",
    goals: ["Learn German greetings", "Formal vs Informal"],
    image: images.mascotFoxTeacher,
    activities: [
      {
        id: "de-u1-l1-act1",
        type: "video_lecture",
        title: "German Teacher greetings",
        instructions: "Practice saying Guten Morgen.",
        vocabularyItems: [
          { id: "de-voc-1", word: "Hallo", meaning: "Hello" },
          { id: "de-voc-2", word: "Guten Tag", meaning: "Good day" }
        ]
      }
    ]
  },
  {
    id: "de-u1-l2",
    unitId: "de-unit-1",
    title: "Self Introductions",
    description: "Introduce your name and hometown in German.",
    xpReward: 25,
    type: "chat",
    goals: ["Say your name", "Say where you live"],
    image: images.streakFire,
    activities: [
      {
        id: "de-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Introduce Yourself",
        instructions: "Say 'Ich heiße...' to the tutor."
      }
    ]
  },
  {
    id: "de-u1-l3",
    unitId: "de-unit-1",
    title: "Essen & Trinken",
    description: "Order water, beer, and bread in German.",
    xpReward: 15,
    type: "interactive",
    goals: ["Order drinks in German"],
    image: images.cafeTable,
    activities: [
      {
        id: "de-u1-l3-act1",
        type: "vocabulary_quiz",
        title: "Drink Identification",
        instructions: "What does 'Wasser' mean?",
        correctAnswer: "Water",
        multipleChoiceOptions: [
          { id: "de-opt-1", text: "Beer", isCorrect: false },
          { id: "de-opt-2", text: "Water", isCorrect: true },
          { id: "de-opt-3", text: "Milk", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "de-u1-l4",
    unitId: "de-unit-1",
    title: "Berlin Directions",
    description: "Find your way around Berlin's public transit.",
    xpReward: 20,
    type: "video",
    goals: ["Ask where the U-Bahn is"],
    image: { uri: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=150&auto=format&fit=crop" },
    activities: [
      {
        id: "de-u1-l4-act1",
        type: "video_lecture",
        title: "U-Bahn Directions",
        instructions: "Learn to ask 'Wo ist die U-Bahn?'"
      }
    ]
  },
  {
    id: "de-u1-l5",
    unitId: "de-unit-1",
    title: "Supermarket Shopping",
    description: "Buy groceries and check prices in German.",
    xpReward: 25,
    type: "chat",
    goals: ["Ask for grocery prices"],
    image: images.treasure,
    activities: [
      {
        id: "de-u1-l5-act1",
        type: "ai_tutor_chat",
        title: "Groceries Chat",
        instructions: "Shop for bread and apples."
      }
    ]
  },

  // ==========================================
  // ── CHINESE LESSONS (zh-unit-1) ────────────
  // ==========================================
  {
    id: "zh-u1-l1",
    unitId: "zh-unit-1",
    title: "Chinese Greetings",
    description: "Master basic Ni Hao greetings and Chinese tones.",
    xpReward: 20,
    type: "video",
    goals: ["Say Ni Hao", "Learn basic Chinese tones"],
    image: images.mascotFoxTeacher,
    activities: [
      {
        id: "zh-u1-l1-act1",
        type: "video_lecture",
        title: "Tones Practice",
        instructions: "Repeat Ni Hao with correct tones.",
        vocabularyItems: [
          { id: "zh-voc-1", word: "你好 (Nǐ hǎo)", meaning: "Hello" }
        ]
      }
    ]
  },
  {
    id: "zh-u1-l2",
    unitId: "zh-unit-1",
    title: "Introductions",
    description: "Introduce your name in Chinese.",
    xpReward: 25,
    type: "chat",
    goals: ["Say your Chinese name"],
    image: images.streakFire,
    activities: [
      {
        id: "zh-u1-l2-act1",
        type: "ai_tutor_chat",
        title: "Name Chat",
        instructions: "Tell the tutor your name using 'Wǒ jiào...'"
      }
    ]
  },
  {
    id: "zh-u1-l3",
    unitId: "zh-unit-1",
    title: "Food & Chinese Tea",
    description: "Learn to identify Tea and Rice in Chinese.",
    xpReward: 15,
    type: "interactive",
    goals: ["Learn food vocabulary"],
    image: images.cafeTable,
    activities: [
      {
        id: "zh-u1-l3-act1",
        type: "vocabulary_quiz",
        title: "Tea Quiz",
        instructions: "What does '茶 (Chá)' mean?",
        correctAnswer: "Tea",
        multipleChoiceOptions: [
          { id: "zh-opt-1", text: "Rice", isCorrect: false },
          { id: "zh-opt-2", text: "Tea", isCorrect: true },
          { id: "zh-opt-3", text: "Water", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: "zh-u1-l4",
    unitId: "zh-unit-1",
    title: "Beijing Directions",
    description: "Ask directions to the subway in Beijing.",
    xpReward: 20,
    type: "video",
    goals: ["Ask where the subway station is"],
    image: { uri: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=150&auto=format&fit=crop" },
    activities: [
      {
        id: "zh-u1-l4-act1",
        type: "video_lecture",
        title: "Subway Directions",
        instructions: "Ask 'Wo de ditiezhan zai nali?'"
      }
    ]
  },
  {
    id: "zh-u1-l5",
    unitId: "zh-unit-1",
    title: "Market Shopping",
    description: "Shop for tea and fruits in a traditional Chinese market.",
    xpReward: 25,
    type: "chat",
    goals: ["Negotiate prices"],
    image: images.treasure,
    activities: [
      {
        id: "zh-u1-l5-act1",
        type: "ai_tutor_chat",
        title: "Market Chat",
        instructions: "Ask how much the tea is."
      }
    ]
  }
];

/**
 * Helper to get lessons by unit
 */
export const getLessonsByUnit = (unitId: string): Lesson[] => {
  return lessons.filter((lesson) => lesson.unitId === unitId);
};
