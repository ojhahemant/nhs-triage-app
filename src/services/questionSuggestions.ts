import { ClinicalCaseCategory } from "./openaiService";

interface TriageDataType {
  patientInfo: {
    age: string;
    symptoms: string[];
  };
  assessment: {
    urgencyScore: number;
    recommendedTimeframe: string;
    recommendedSpecialty: string;
    recommendationReason: string;
    categorization?: {
      category: ClinicalCaseCategory;
      confidence: number;
      rationale: string;
    };
  };
}

/**
 * Generates contextually relevant suggested questions based on triage data
 */
export const generateSuggestedQuestions = (triageData: TriageDataType): string[] => {
  const questions: string[] = [];
  const { categorization } = triageData.assessment;
  const { symptoms } = triageData.patientInfo;
  
  // If no categorization data is available, return general questions
  if (!categorization) {
    return [
      "What factors go into triage decisions?",
      "How does the AI categorization work?",
      "What information would help improve the assessment?",
    ];
  }
  
  // Add category-specific questions based on NHS expert guidelines
  switch (categorization.category) {
    case ClinicalCaseCategory.URGENT:
      questions.push(
        "Why is this case considered urgent?",
        "What's the recommended timeframe for this referral?",
        "What are the key malignancy indicators I should look for?",
        "How should I communicate urgency to the patient?",
        "What immediate precautions should the patient take?",
        "Which specialist should see this patient first?",
        "What red flag symptoms indicate worsening condition?",
        "How can I fast-track this referral?"
      );
      break;
    case ClinicalCaseCategory.ROUTINE:
      questions.push(
        "What makes this a routine case rather than urgent?",
        "What's the expected waiting time for routine referrals?",
        "What should I tell the patient about timing?",
        "Are there any warning signs to watch for?",
        "What interim management can I provide?",
        "How should I monitor the patient while waiting?",
        "What would escalate this to urgent priority?"
      );
      break;
    case ClinicalCaseCategory.NON_PRIORITY:
      questions.push(
        "What self-care advice can I give this patient?",
        "What symptoms should the patient watch for?",
        "When should the patient seek further assessment?",
        "Are there any treatments to recommend in the meantime?",
        "How should I communicate the timeline to the patient?",
        "What follow-up arrangements are needed?",
        "Could this become more urgent over time?",
        "What lifestyle advice might help?"
      );
      break;
  }
  
  // Add confidence-specific questions
  const confidence = categorization.confidence;
  if (confidence < 0.7) {
    questions.push(
      "Why is the AI confidence level low?",
      "What additional information might help with classification?",
      "Should I seek a second opinion for this case?"
    );
  }
  
  // Add symptom-specific questions
  if (symptoms.length > 0) {
    if (symptoms.includes("Bleeding")) {
      questions.push("Is bleeding always a sign of malignancy?");
    }
    if (symptoms.includes("Itching")) {
      questions.push("What does itching suggest about this lesion?");
    }
    if (symptoms.includes("Pain")) {
      questions.push("Is pain a significant concern in this context?");
    }
    if (symptoms.includes("Color changes") || symptoms.includes("Irregular borders")) {
      questions.push("What appearance changes are most concerning?");
    }
    if (symptoms.includes("Fast-growing")) {
      questions.push("How concerning is the rapid growth in this context?");
    }
  }
  
  // Add general questions that are always useful
  questions.push(
    "What should I document in the referral?",
    "What patient education should I provide?",
    "Are there any red flags I should watch for?"
  );
  
  // Limit to 6 questions to avoid overwhelming the UI
  return questions.slice(0, 6);
};
