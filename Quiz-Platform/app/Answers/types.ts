export type QuestionType =
  | "mcq"
  | "msq"
  | "short_answer"
  | "long_answer"
  | "matching"
  | "ordering";

interface BaseQuestion {
  id: number;
  questionText: string;
  explanation: string;
}

export interface McqQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  correctOption: string;
}

export interface MsqQuestion extends BaseQuestion {
  type: "msq";
  options: string[];
  correctAnswers: string[];
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: "short_answer";
  correct_keyword: string;
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: "long_answer";
  evaluation_rubric: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  left_pairs: string[];
  right_pairs: string[];
  correct_mapping: Record<string, string>;
}

export interface OrderingQuestion extends BaseQuestion {
  type: "ordering";
  items_to_order: string[];
  correct_sequence: string[];
}

export type Question =
  | McqQuestion
  | MsqQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | MatchingQuestion
  | OrderingQuestion;

export interface AnswerKeyResponse {
  completed: true;
  topic: string;
  target_topics: string[];
  file_used: string[];
  questions: Question[];
}