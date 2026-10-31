// controllers/aiController.js
const OpenAI = require("openai");

/**
 * Generates an intelligent, domain-specific contextual description based on keywords.
 * Used when external AI service is offline, key is unconfigured, or account credits are exhausted.
 */
const generateContextualDescription = (title) => {
  const lower = title.toLowerCase();

  if (lower.includes("gym") || lower.includes("workout") || lower.includes("fitness") || lower.includes("exercise") || lower.includes("training")) {
    return `Plan and execute workout for "${title}". Establish a structured gym workout routine covering strength training, cardio, and core exercises. Focus on proper form, track personal records weekly, and maintain a consistent nutrition and recovery schedule.`;
  }

  if (lower.includes("dbms") || lower.includes("database") || lower.includes("sql") || lower.includes("mongodb")) {
    return `Review database management requirements, design normalized schema tables (up to 3NF), and write optimized queries. Verify constraints, indexing, and test all data operations before finalizing.`;
  }

  if (lower.includes("assignment") || lower.includes("homework") || lower.includes("practical") || lower.includes("lab")) {
    return `Review assignment guidelines and evaluation criteria for "${title}". Break the work into sequential milestones, implement the required solutions, and verify deliverables before submission.`;
  }

  if (lower.includes("docker") || lower.includes("deploy") || lower.includes("kubernetes") || lower.includes("ci/cd") || lower.includes("pipeline")) {
    return `Plan deployment steps for "${title}". Configure Dockerfile and multi-stage container builds. Verify service networking, volume persistence, and environment variable bindings before running deployment checks.`;
  }

  if (lower.includes("doctor") || lower.includes("health") || lower.includes("appointment") || lower.includes("medical") || lower.includes("clinic")) {
    return `Schedule and prepare for the consultation. Note down current symptoms, organize relevant medical reports and prescriptions, and arrive 15 minutes before the scheduled time.`;
  }

  if (lower.includes("buy") || lower.includes("grocery") || lower.includes("groceries") || lower.includes("shopping") || lower.includes("order")) {
    return `Create a categorized shopping list of essential items. Check existing pantry inventory, compare prices, and complete the purchases according to priority.`;
  }

  if (lower.includes("exam") || lower.includes("study") || lower.includes("test") || lower.includes("revision") || lower.includes("quiz")) {
    return `Organize syllabus topics and lecture notes into focused study blocks. Review core concepts, practice past questions, and create summary flashcards for high-priority topics.`;
  }

  if (lower.includes("meeting") || lower.includes("interview") || lower.includes("call") || lower.includes("presentation")) {
    return `Prepare the agenda and talking points for "${title}". Review background materials, prepare key questions, and ensure meeting notes and action items are documented.`;
  }

  if (lower.includes("bug") || lower.includes("fix") || lower.includes("issue") || lower.includes("error") || lower.includes("debug")) {
    return `Investigate the root cause of "${title}". Reproduce the issue with test cases, implement a targeted code fix, and verify that all regression tests pass.`;
  }

  // High quality generalized description
  return `Define clear objectives and milestones for "${title}". Gather all necessary resources, execute the primary deliverables in order of priority, and review the final output against requirements.`;
};

/**
 * Generate a task description using OpenAI API (model: gpt-4o-mini).
 * Fallback to intelligent contextual description if API key is missing, invalid, or out of credits.
 */
const generateDescription = async (req, res) => {
  const { title } = req.body || {};

  // 1. Validation: task title is required and must be non-empty string
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required to generate a description."
    });
  }

  const trimmedTitle = title.trim();

  // 2. Secure API key check (clean any stray characters e.g. accidental 'y')
  let rawApiKey = process.env.OPENAI_API_KEY || "";
  let cleanApiKey = rawApiKey.trim().replace(/^y+sk-/, "sk-");

  const isKeyConfigured =
    cleanApiKey !== "" &&
    !cleanApiKey.includes("your_actual_api_key_here") &&
    !cleanApiKey.includes("your_openai_api_key_here") &&
    !cleanApiKey.includes("replace_with");

  if (!isKeyConfigured) {
    return res.status(200).json({
      success: true,
      description: generateContextualDescription(trimmedTitle),
      isFallback: true,
      message: "API key not configured. Contextual draft description generated."
    });
  }

  // 3. Request description from OpenAI
  try {
    const openai = new OpenAI({
      apiKey: cleanApiKey,
      timeout: 10000 // 10 second timeout to prevent hanging
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful task management assistant. Generate a concise, practical, and actionable task description (2 to 3 sentences) for the given task title. Do not include markdown headers, quotes, or sensitive information. Output plain text only."
        },
        {
          role: "user",
          content: `Task Title: "${trimmedTitle}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const generatedText = completion.choices?.[0]?.message?.content?.trim();

    if (!generatedText) {
      throw new Error("Empty response received from AI model.");
    }

    return res.status(200).json({
      success: true,
      description: generatedText
    });
  } catch (error) {
    // Log safe error summary without exposing secrets
    console.error(`[AI Service Notice]: ${error.status || error.name || "Error"} - ${error.message || "Failed to contact OpenAI"}`);

    let userNotice = "AI service temporarily unavailable. Contextual draft description provided.";
    if (error.status === 429 || (error.message && error.message.includes("quota"))) {
      userNotice = "OpenAI account has zero credits remaining. Contextual draft description provided.";
    } else if (error.status === 401) {
      userNotice = "OpenAI API key was invalid or expired. Contextual draft description provided.";
    }

    // Return rich contextual description without crashing the application
    return res.status(200).json({
      success: true,
      description: generateContextualDescription(trimmedTitle),
      isFallback: true,
      message: userNotice
    });
  }
};

module.exports = {
  generateDescription,
  generateContextualDescription
};
