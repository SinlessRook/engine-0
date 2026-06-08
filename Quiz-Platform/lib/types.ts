export type QuestionType = 
  | 'multiple-choice' 
  | 'multiple-select' 
  | 'true-false' 
  | 'short-answer' 
  | 'long-answer' 
  | 'matching' 
  | 'drag-order'
  | 'mcq'
  | 'msq'
  | 'ordering';

export interface Option {
  id: string;
  text: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string | number;
  type: QuestionType;
  question?: string;
  questionText?: string; // Backend format
  options?: Option[]; // for multiple-choice, multiple-select
  correctAnswer?: string | string[]; // for multiple-choice, multiple-select, true-false
  correctOption?: string; // Backend format for mcq
  correctAnswers?: string[]; // for multiple-select
  correctMapping?: Record<string, string>; // Backend format for matching
  correct_sequence?: string[]; // Backend format for ordering
  items_to_order?: string[]; // Backend format for ordering
  pairs?: MatchingPair[]; // for matching
  left_pairs?: string[]; // Backend format for matching
  right_pairs?: string[]; // Backend format for matching
  orderItems?: { id: string; text: string }[]; // for drag-order
  explanation?: string;
  evaluation_rubric?: string; // Backend format for long_answer
}

export interface Quiz {
  id?: string;
  _id?: string; // MongoDB ID
  title?: string;
  description?: string;
  questions: Question[];
  target_topics?: string[];
  topic?: string;
  file_used?: string[];
  completed?: boolean;
}

export interface Answer {
  questionId: string;
  answer: string | string[] | Record<string, string>; // varies by type
}

export interface QuizSubmission {
  quizId: string;
  answers: Answer[];
  metadata: {
    completionTime: number; // in ms
    userAgent: string;
  };
}
