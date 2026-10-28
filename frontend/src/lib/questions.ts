import rawQuestions from "../content/questions.json";
import { Question, QuestionLevel, QuestionsArraySchema } from "./schema";

// Validate questions data on load
const parsedQuestions: Question[] = QuestionsArraySchema.parse(rawQuestions);

export function getAllQuestions(): readonly Question[] {
  return parsedQuestions;
}

export function getActiveQuestions(): readonly Question[] {
  return parsedQuestions.filter((q) => q.active);
}

export function getQuestionsByLevel(level: QuestionLevel): readonly Question[] {
  return parsedQuestions.filter((q) => q.active && q.level === level);
}

export function getQuestionById(id: string): Question | undefined {
  return parsedQuestions.find((q) => q.id === id);
}

export function getActiveQuestionIdsByLevel(level: QuestionLevel): string[] {
  return getQuestionsByLevel(level).map((q) => q.id);
}

