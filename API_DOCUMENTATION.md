# API Documentation: Gemini Neural Chat Interface

The **FIFA Nexus AI** platform leverages a unified API routing handler at `/api/chat` to process multi-language natural conversations, analyze questions, and output predictive spatial responses.

---

## Endpoint: POST `/api/chat`

Processes dialogue histories and retrieves operations answers.

### Request Headers
- `Content-Type`: `application/json`

### Request Body Schema
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Where is the nearest toilet?"
    }
  ],
  "language": "en" // en | es | hi (English, Spanish, Hindi fallbacks)
}
```

### Response Schema (Success 200)
```json
{
  "content": "Washrooms are located behind Section 101 (North) and Section 104 (South). Section 101 has wheelchair-accessible facilities."
}
```

### Response Schema (Error 400/500)
```json
{
  "error": "Missing messages parameter"
}
```

---

## Backend Neural Architecture & Routing Logic

When a client queries `/api/chat`:

1. **System Instruction Guardrails**: If a `GEMINI_API_KEY` environment key is set, the API instantiates `GoogleGenerativeAI` with model `gemini-1.5-flash`. A detailed prompt coordinates response scope, forcing short answers and emergency instructions if distress terms ("fire", "help", "stampede") are matched.
2. **Local Simulation fallback**: If no API key is specified, the router falls back to an internal keyword classifier, matching phrases to languages (English, Hindi, Spanish) to return appropriate answers, ensuring complete functionality without internet access.
