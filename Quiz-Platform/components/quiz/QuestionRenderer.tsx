'use client';

import { Question } from '@/lib/types';
import { MultipleChoice } from './questions/MultipleChoice';
import { MultipleSelect } from './questions/MultipleSelect';
import { TrueFalse } from './questions/TrueFalse';
import { ShortAnswer } from './questions/ShortAnswer';
import { LongAnswer } from './questions/LongAnswer';
import { Matching } from './questions/Matching';
import { DragOrder } from './questions/DragOrder';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

// Normalize question type from backend format to frontend format
function normalizeQuestion(question: Question): Question {
  const normalized = { ...question };
  
  // Map backend type names to frontend type names
  if (question.type === 'mcq') {
    normalized.type = 'multiple-choice';
    // Map backend properties to frontend properties
    if (question.correctOption && !question.correctAnswer) {
      normalized.correctAnswer = question.correctOption;
    }
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
    // Transform string options to Option objects
    if (Array.isArray(question.options) && question.options.length > 0) {
      if (typeof question.options[0] === 'string') {
        normalized.options = (question.options as string[]).map((opt: string, index: number) => ({
          id: `mcq-option-${index}`,
          text: opt,
        }));
        // Update correctAnswer to use the new ID format if it matches an option
        if (normalized.correctAnswer && typeof normalized.correctAnswer === 'string') {
          const matchingIndex = (question.options as string[]).indexOf(normalized.correctAnswer as string);
          if (matchingIndex !== -1) {
            normalized.correctAnswer = `mcq-option-${matchingIndex}`;
          }
        }
      }
    }
  } else if (question.type === 'msq') {
    normalized.type = 'multiple-select';
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
    // Transform string options to Option objects
    if (Array.isArray(question.options) && question.options.length > 0) {
      if (typeof question.options[0] === 'string') {
        normalized.options = (question.options as string[]).map((opt: string, index: number) => ({
          id: `msq-option-${index}`,
          text: opt,
        }));
        // Update correctAnswers to use the new ID format
        if (Array.isArray(normalized.correctAnswers)) {
          normalized.correctAnswers = normalized.correctAnswers.map((ans) => {
            const matchingIndex = (question.options as string[]).indexOf(ans as string);
            return matchingIndex !== -1 ? `msq-option-${matchingIndex}` : ans;
          });
        }
      }
    }
  } else if (question.type === 'ordering') {
    normalized.type = 'drag-order';
    // Convert backend format to frontend format
    if (question.items_to_order && !question.orderItems) {
      normalized.orderItems = question.items_to_order.map((item: string, index: number) => ({
        id: `item-${index}`,
        text: item,
      }));
    }
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
  } else if (question.type === 'matching') {
    if (question.left_pairs && question.right_pairs && !question.pairs) {
      // Convert array format to pair objects
      normalized.pairs = (question.left_pairs as string[]).map((left: string, index: number) => ({
        id: `pair-${index}`,
        left,
        right: (question.right_pairs as string[])[index] || '',
      }));
    }
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
  } else if (question.type === 'long_answer' || question.type === 'long-answer') {
    normalized.type = 'long-answer';
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
  } else if (question.type === 'short_answer' || question.type === 'short-answer') {
    normalized.type = 'short-answer';
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
  } else if (question.type === 'true-false') {
    if (question.questionText && !question.question) {
      normalized.question = question.questionText;
    }
  }
  
  return normalized;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  const normalizedQuestion = normalizeQuestion(question);
  
  switch (normalizedQuestion.type) {
    case 'multiple-choice':
      return (
        <MultipleChoice
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'multiple-select':
      return (
        <MultipleSelect
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'true-false':
      return (
        <TrueFalse
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'short-answer':
      return (
        <ShortAnswer
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'long-answer':
      return (
        <LongAnswer
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'matching':
      return (
        <Matching
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    case 'drag-order':
      return (
        <DragOrder
          question={normalizedQuestion}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return <div>Unknown question type: {normalizedQuestion.type}</div>;
  }
}
