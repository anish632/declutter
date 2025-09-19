import { GoogleGenerativeAI } from '@google/generative-ai';
import { DecisionScore, DecisionCriteria, ItemCategory, RoomAssessment } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzeItemDecision(
    item: Partial<ItemCategory>,
    roomContext: Partial<RoomAssessment>,
    userPhilosophy: string
  ): Promise<DecisionScore> {
    const prompt = this.buildDecisionPrompt(item, roomContext, userPhilosophy);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseDecisionResponse(text);
    } catch (error) {
      console.error('Error analyzing item decision:', error);
      return this.getFallbackDecision(item);
    }
  }

  async generateRoomAnalysis(room: RoomAssessment): Promise<{
    insights: string[];
    recommendations: string[];
    priorityActions: string[];
  }> {
    const prompt = `
    Analyze this room's organization state and provide insights:

    Room: ${room.roomName}
    Clutter Level: ${room.currentState.clutterLevel}/10
    Functionality Score: ${room.currentState.functionalityScore}/10
    Joy Factor: ${room.currentState.joyFactor}/10
    Energy Flow: ${room.currentState.energyFlow}/10
    Accessibility: ${room.currentState.accessibilityScore}/10

    Categories: ${room.categories.map(c => `${c.name} (${c.itemCount} items, ${c.keepDecision})`).join(', ')}

    Provide a JSON response with:
    - insights: Array of 3-5 key observations
    - recommendations: Array of 3-5 specific actionable recommendations
    - priorityActions: Array of 2-3 highest impact actions to take first

    Focus on practical, achievable improvements based on the organization methodologies: Marie Kondo, 5S, Lean Six Sigma, and Feng Shui principles.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse JSON response
      const cleanText = text.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error generating room analysis:', error);
      return {
        insights: ['Unable to generate insights at this time'],
        recommendations: ['Please try again later'],
        priorityActions: ['Check your internet connection'],
      };
    }
  }

  async generateMotivationalMessage(
    userStats: {
      currentStreak: number;
      totalPoints: number;
      recentAchievements: string[];
      strugglingAreas: string[];
    },
    philosophy: string
  ): Promise<string> {
    const prompt = `
    Generate a personalized motivational message for a home organization user:

    Current Streak: ${userStats.currentStreak} days
    Total Points: ${userStats.totalPoints}
    Recent Achievements: ${userStats.recentAchievements.join(', ')}
    Areas of Struggle: ${userStats.strugglingAreas.join(', ')}
    Primary Philosophy: ${philosophy}

    Create an encouraging, personalized message (2-3 sentences) that:
    - Acknowledges their progress
    - Addresses their struggles with compassion
    - Aligns with their chosen philosophy
    - Provides specific next step encouragement

    Keep it warm, supportive, and actionable.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating motivational message:', error);
      return this.getFallbackMotivationalMessage(philosophy);
    }
  }

  private buildDecisionPrompt(
    item: Partial<ItemCategory>,
    roomContext: Partial<RoomAssessment>,
    userPhilosophy: string
  ): string {
    return `
    Analyze this item for a keep/donate/discard decision using multiple organization methodologies:

    Item Details:
    - Name: ${item.name || 'Unknown item'}
    - Count: ${item.itemCount || 1}
    - Usage Frequency: ${item.frequency || 'unknown'}
    - Current Joy Rating: ${item.joyRating || 'not rated'}/10

    Room Context:
    - Room: ${roomContext.roomName || 'Unknown room'}
    - Current Clutter Level: ${roomContext.currentState?.clutterLevel || 'unknown'}/10
    - Functionality Score: ${roomContext.currentState?.functionalityScore || 'unknown'}/10

    User's Primary Philosophy: ${userPhilosophy}

    Evaluate this item using ALL four methodologies and provide scores (0-100):

    1. Marie Kondo Criteria (25% weight):
       - Joy factor: Does this spark joy?
       - Category completion: Is this category being addressed systematically?
       - Gratitude: Can we thank this item if letting it go?

    2. Toyota 5S Criteria (30% weight):
       - Sort: Is this necessary for the room's function?
       - Set in Order: Does it have an efficient designated place?
       - Shine: How much maintenance does it require?
       - Standardize: Does keeping it support consistent processes?
       - Sustain: Is it viable long-term?

    3. Lean Six Sigma Waste Elimination (25% weight):
       - Transportation waste: Hard to access?
       - Inventory waste: Do we have excess?
       - Motion waste: Inefficient placement?
       - Waiting waste: Time to find it?
       - Over-processing: Complex organization needed?
       - Over-production: Buying duplicates?
       - Defects: Broken or unused?

    4. Eastern Philosophy (20% weight):
       - Energy flow: Does it enhance room energy?
       - Mindfulness: Does it support present-moment awareness?
       - Simplicity: Does it align with minimalist principles?
       - Seasonal harmony: Is it seasonally appropriate?

    Provide your response as JSON with this exact structure:
    {
      "overallScore": number (0-100),
      "recommendation": "keep" | "donate" | "discard" | "needs_review",
      "confidence": number (0-100),
      "reasoning": ["reason1", "reason2", "reason3"],
      "criteriaBreakdown": {
        "marieKondo": { "joyFactor": number, "categoryCompletion": number, "gratitudeAcknowledged": boolean },
        "toyota5S": { "sort": number, "setInOrder": number, "shine": number, "standardize": number, "sustain": number },
        "leanSixSigma": { "transportationWaste": number, "inventoryWaste": number, "motionWaste": number, "waitingWaste": number, "overProcessingWaste": number, "overProductionWaste": number, "defects": number },
        "easternPhilosophy": { "energyFlowContribution": number, "mindfulnessEnhancement": number, "simplicityAlignment": number, "seasonalHarmony": number }
      }
    }
    `;
  }

  private parseDecisionResponse(response: string): DecisionScore {
    try {
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '');
      const parsed = JSON.parse(cleanResponse);

      return {
        overallScore: parsed.overallScore || 50,
        recommendation: parsed.recommendation || 'needs_review',
        confidence: parsed.confidence || 50,
        reasoning: parsed.reasoning || ['Analysis unavailable'],
        criteriaBreakdown: parsed.criteriaBreakdown || this.getDefaultCriteria(),
      };
    } catch (error) {
      console.error('Error parsing decision response:', error);
      return this.getFallbackDecision();
    }
  }

  private getFallbackDecision(item?: Partial<ItemCategory>): DecisionScore {
    return {
      overallScore: 50,
      recommendation: 'needs_review',
      confidence: 30,
      reasoning: ['Unable to analyze at this time', 'Please review manually'],
      criteriaBreakdown: this.getDefaultCriteria(),
    };
  }

  private getDefaultCriteria(): DecisionCriteria {
    return {
      marieKondo: {
        joyFactor: 50,
        categoryCompletion: 50,
        gratitudeAcknowledged: false,
      },
      toyota5S: {
        sort: 50,
        setInOrder: 50,
        shine: 50,
        standardize: 50,
        sustain: 50,
      },
      leanSixSigma: {
        transportationWaste: 50,
        inventoryWaste: 50,
        motionWaste: 50,
        waitingWaste: 50,
        overProcessingWaste: 50,
        overProductionWaste: 50,
        defects: 50,
      },
      easternPhilosophy: {
        energyFlowContribution: 50,
        mindfulnessEnhancement: 50,
        simplicityAlignment: 50,
        seasonalHarmony: 50,
      },
    };
  }

  private getFallbackMotivationalMessage(philosophy: string): string {
    const messages = {
      marie_kondo: "Every item you mindfully consider brings you closer to a space that truly sparks joy. Trust your intuition—you know what belongs in your life.",
      lean: "Progress, not perfection! Each small improvement in your organization system creates lasting value. Keep eliminating what doesn't serve you.",
      agile: "Great work on your organization sprints! Remember, it's about continuous improvement—small daily actions lead to big transformations.",
      feng_shui: "Your spaces are beginning to flow with better energy. Trust the process and let go of what blocks your path to harmony.",
      balanced: "You're building sustainable organization habits that honor multiple wisdom traditions. Every step forward matters."
    };

    return messages[philosophy as keyof typeof messages] || messages.balanced;
  }
}

export const geminiService = new GeminiService();