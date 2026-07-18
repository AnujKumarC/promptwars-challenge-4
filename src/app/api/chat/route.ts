import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are FIFA Nexus AI, the official tournament and smart stadium AI operations assistant for the FIFA World Cup 2026.
Your job is to assist fans, volunteers, security, medical personnel, and organizers.

Stadium Coordinates & Rules:
- The stadium is "FIFA Nexus Arena". It contains: Entrance A (North), Entrance B (South), Seat Blocks 101, 102, 103, 104, North & South Food Courts, North & South Washrooms, Concourse Medical Station, Metro Terminal, VIP Parking.
- Gates are Gate A, B, C, D. Gate C is currently congested. Suggest Gate D.
- Route modes: Shortest, Accessible (Wheelchair - uses ramps/elevators), Low Crowd, and Evacuation.
- Emergency exits: Emergency Exit East, Gate B.
- Accessibility features: Speech synthesis, font scaling, high contrast, sign language guides.
- Multilingual support: Support translation across English, Hindi, Kannada, Spanish, French, Arabic, Japanese, German, Portuguese, Chinese.

Be concise, supportive, and clear. If an emergency is mentioned, tell the user to follow the flashing red indicators on the map immediately and locate nearby marshals.`;

// Pre-baked answers for local simulator fallback
const LOCAL_RESPONSES: Record<string, Record<string, string>> = {
  en: {
    hello: "Hello! I am FIFA Nexus AI, your Smart Stadium assistant. How can I help you today?",
    gate: "Gate C is currently busy with a 15-minute wait time. I recommend using Gate D or Entrance A (North) for faster access.",
    food: "The North Food Court has premium burgers (12m wait), and the South Food Court features vegan tacos (8m wait). Do you have any dietary restrictions (Halal, Vegan, Veg, Jain)?",
    medical: "The main Medical Station is on the concourse level near Block 103. If this is a life-threatening emergency, please stay calm; medical crews have been notified.",
    washroom: "Washrooms are located behind Section 101 (North) and Section 104 (South). Section 101 has wheelchair-accessible facilities.",
    parking: "VIP Parking Lot A is at 82% capacity. Shuttle buses are running every 3 minutes from Parking Lot B to Gate A.",
    metro: "The Metro Station is located at the West gate. Trains are running every 4 minutes. A wheelchair-accessible transit ramp is active at Platform 2.",
    emergency: "EMERGENCY PROCEDURES ACTIVE: Please locate the nearest exit marked by the flashing RED paths on your map. Do not use elevators. Follow instructions from security volunteers.",
    default: "I can assist you with match schedules, stadium navigation, food options, parking, wheelchair routes, and emergency guidelines. What would you like to know?"
  },
  es: {
    hello: "¡Hola! Soy FIFA Nexus AI, tu asistente en el estadio. ¿Cómo puedo ayudarte hoy?",
    gate: "La Puerta C está congestionada (espera de 15 min). Te recomiendo usar la Puerta D o la Entrada A para un acceso más rápido.",
    food: "El patio de comidas norte ofrece hamburguesas premium, y el sur tiene tacos veganos. ¿Tienes alguna restricción dietética (Halal, Vegano, Jain)?",
    medical: "La estación médica principal está en el nivel del pasillo cerca del Bloque 103. En caso de emergencia, los paramédicos están informados.",
    washroom: "Los baños están detrás de la Sección 101 (Norte) y la Sección 104 (Sur). La Sección 101 tiene acceso para sillas de ruedas.",
    parking: "El estacionamiento VIP A está al 82%. Hay traslados cada 3 minutos desde el estacionamiento B hacia la Puerta A.",
    metro: "La estación de Metro está en la puerta oeste. Los trenes pasan cada 4 minutos. Hay una rampa accesible en la Plataforma 2.",
    emergency: "ALERTA DE EMERGENCIA: Diríjase a la salida más cercana siguiendo las rutas ROJAS parpadeantes. Siga las instrucciones del personal.",
    default: "Puedo ayudarte con horarios, navegación, comida, estacionamiento, rutas accesibles y emergencias. ¿Qué necesitas?"
  },
  hi: {
    hello: "नमस्ते! मैं फीफा नेक्सस एआई हूं, आपका स्मार्ट स्टेडियम सहायक। आज मैं आपकी क्या सहायता कर सकता हूं?",
    gate: "गेट सी वर्तमान में व्यस्त है (15 मिनट प्रतीक्षा)। तेज़ प्रवेश के लिए गेट डी या प्रवेश द्वार ए का उपयोग करें।",
    food: "उत्तर फ़ूड कोर्ट में प्रीमियम बर्गर हैं, और दक्षिण फ़ूड कोर्ट में शाकाहारी टैकोस हैं। क्या आपकी कोई आहार प्राथमिकताएं (हलाल, जैन) हैं?",
    medical: "मुख्य चिकित्सा स्टेशन ब्लॉक 103 के पास है। यदि आपातकालीन स्थिति है, तो शांत रहें; चिकित्सा दल को सूचित कर दिया गया है।",
    washroom: "वॉशरुम सेक्शन 101 (उत्तर) और सेक्शन 104 (दक्षिण) के पीछे स्थित हैं। सेक्शन 101 में व्हीलचेयर सुविधा उपलब्ध है।",
    parking: "वीआईपी पार्किंग लॉट ए 82% भरा हुआ है। पार्किंग लॉट बी से गेट ए के लिए हर 3 मिनट में शटल बसें चल रही हैं।",
    metro: "मेट्रो स्टेशन वेस्ट गेट पर है। ट्रेनें हर 4 मिनट में चल रही हैं। प्लेटफॉर्म 2 पर व्हीलचेयर रैंप सक्रिय है।",
    emergency: "आपातकालीन चेतावनी: कृपया अपने मानचित्र पर चमकते लाल रास्तों द्वारा चिह्नित निकटतम निकास पर जाएं। सुरक्षा कर्मियों के निर्देशों का पालन करें।",
    default: "मैं मैच शेड्यूल, स्टेडियम नेविगेशन, भोजन, पार्किंग, व्हीलचेयर और आपातकालीन दिशानिर्देशों में सहायता कर सकता हूं।"
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, language = "en" } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages parameter" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY;

    // Use Gemini API if Key is present
    if (apiKey && apiKey !== "YOUR_API_KEY") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT
        });

        // Format history for Gemini API
        const contents = messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }]
        }));

        const result = await model.generateContent({ contents });
        const responseText = result.response.text();
        
        return NextResponse.json({ content: responseText });
      } catch (geminiError: any) {
        console.error("Gemini API Error, falling back to local simulator:", geminiError);
        // Fail down to simulator if API keys fails due to quotes/format
      }
    }

    // High Fidelity Local Fallback Simulator
    const langResponses = LOCAL_RESPONSES[language] || LOCAL_RESPONSES["en"];
    let responseText = langResponses.default;

    if (lastMessage.includes("hello") || lastMessage.includes("hi") || lastMessage.includes("hey")) {
      responseText = langResponses.hello;
    } else if (lastMessage.includes("gate") || lastMessage.includes("entrance") || lastMessage.includes("crowd") || lastMessage.includes("congest")) {
      responseText = langResponses.gate;
    } else if (lastMessage.includes("food") || lastMessage.includes("burger") || lastMessage.includes("diet") || lastMessage.includes("eat") || lastMessage.includes("vegan") || lastMessage.includes("halal") || lastMessage.includes("jain")) {
      responseText = langResponses.food;
    } else if (lastMessage.includes("medical") || lastMessage.includes("hospital") || lastMessage.includes("hurt") || lastMessage.includes("doctor") || lastMessage.includes("sick")) {
      responseText = langResponses.medical;
    } else if (lastMessage.includes("washroom") || lastMessage.includes("toilet") || lastMessage.includes("restroom") || lastMessage.includes("atm")) {
      responseText = langResponses.washroom;
    } else if (lastMessage.includes("parking") || lastMessage.includes("car") || lastMessage.includes("drive")) {
      responseText = langResponses.parking;
    } else if (lastMessage.includes("metro") || lastMessage.includes("bus") || lastMessage.includes("train") || lastMessage.includes("transport")) {
      responseText = langResponses.metro;
    } else if (lastMessage.includes("emergency") || lastMessage.includes("fire") || lastMessage.includes("stampede") || lastMessage.includes("alert") || lastMessage.includes("danger") || lastMessage.includes("threat")) {
      responseText = langResponses.emergency;
    }

    // Wait a brief simulated latency (500ms) for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({ content: responseText });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
