# Professional Quiz Platform

A mobile-friendly, professional quiz conducting platform built with Next.js, React, and TypeScript. Supports 7 different question types and integrates seamlessly with external result APIs.

## Features

✨ **7 Question Types**
- Multiple Choice (single answer)
- Multiple Select (multiple answers)
- True/False
- Short Answer (text input)
- Long Answer (textarea)
- Matching (pair selection)
- Drag & Drop Ordering

📱 **Mobile Optimized**
- Fully responsive design
- Touch-friendly interactions
- Clean, modern UI with professional styling

🎯 **Quiz Management**
- Quiz selection screen
- Progress tracking with visual progress bar
- Navigation between questions (previous/next)
- Error handling for unanswered questions

🔗 **API Integration**
- GET `/api/questions` - Fetch quiz data
- POST `/api/submit-results` - Submit answers to external API

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET `/api/questions`

Fetch available quizzes or a specific quiz.

**Query Parameters:**
- `id` (optional): Quiz ID to fetch a specific quiz. If not provided, returns list of all quizzes.

**Response (Quiz List):**
```json
[
  {
    "id": "quiz-1",
    "title": "General Knowledge",
    "description": "Test your general knowledge across various topics",
    "questionCount": 7
  }
]
```

**Response (Single Quiz):**
```json
{
  "id": "quiz-1",
  "title": "General Knowledge",
  "description": "Test your general knowledge across various topics",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "options": [
        { "id": "a1", "text": "London" },
        { "id": "a2", "text": "Berlin" },
        { "id": "a3", "text": "Paris" },
        { "id": "a4", "text": "Madrid" }
      ],
      "correctAnswer": "a3"
    }
  ]
}
```

### POST `/api/submit-results`

Submit quiz answers to an external API endpoint.

**Request Body:**
```json
{
  "quizId": "quiz-1",
  "answers": [
    {
      "questionId": "q1",
      "answer": "a3"
    },
    {
      "questionId": "q2",
      "answer": "false"
    }
  ],
  "metadata": {
    "completionTime": 45000,
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz results submitted successfully",
  "externalId": "external-submission-id"
}
```

**Offline Response** (if external API unavailable):
```json
{
  "success": true,
  "message": "Quiz results recorded locally (external service unavailable)",
  "offline": true
}
```

## Configuration

### External API Endpoint

Configure the external results API by setting environment variables:

```bash
# .env.local
EXTERNAL_RESULTS_API_URL=https://your-api.com/api/results
EXTERNAL_API_KEY=your-api-key-here  # Optional
```

If `EXTERNAL_RESULTS_API_URL` is not set, the system defaults to `http://localhost:3001/api/results`.

## Project Structure

```
app/
├── layout.tsx                  # Root layout with metadata
├── page.tsx                    # Home page with quiz list
├── api/
│   ├── questions/route.ts      # GET questions endpoint
│   └── submit-results/route.ts # POST results endpoint
│
components/
├── quiz/
│   ├── QuizEngine.tsx          # Main quiz container
│   ├── QuestionRenderer.tsx    # Routes to correct question component
│   ├── ProgressBar.tsx         # Progress indicator
│   ├── SubmissionConfirmation.tsx
│   └── questions/
│       ├── MultipleChoice.tsx
│       ├── MultipleSelect.tsx
│       ├── TrueFalse.tsx
│       ├── ShortAnswer.tsx
│       ├── LongAnswer.tsx
│       ├── Matching.tsx
│       └── DragOrder.tsx
│
lib/
├── types.ts                    # TypeScript types for Quiz, Question, Answer

globals.css                      # Global styles with design tokens
```

## Question Types

### Multiple Choice
Single-selection radio button style question with 4 options.

### Multiple Select
Multi-selection checkbox style question. Users select one or more correct answers.

### True/False
Binary choice between True and False.

### Short Answer
Text input field for brief responses.

### Long Answer
Textarea for extended responses.

### Matching
Match items from left column to right column using dropdown selection.

### Drag & Drop Ordering
Drag to reorder items in the correct sequence.

## Styling

The platform uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **Custom design tokens** in CSS variables for consistent theming
- **Responsive design** with mobile-first approach

Color scheme:
- Primary: Purple/Indigo (#7c3aed)
- Neutral: Grays for backgrounds and borders
- Accent: Red for destructive actions

## Dependencies

- **next**: 16.2.6
- **react**: 19.2.4
- **@dnd-kit/core** & **@dnd-kit/sortable**: Drag & drop for ordering questions
- **lucide-react**: Icons
- **tailwindcss**: Styling
- **shadcn/ui**: UI components

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Format and Lint

```bash
pnpm lint
```

### Build

```bash
pnpm build
pnpm start
```

## API Error Handling

The system gracefully handles API failures:

1. **GET /api/questions**: Returns 404 if quiz not found, 500 on server error
2. **POST /api/submit-results**: Attempts to call external API but falls back to local recording if unavailable

All errors are logged to console for debugging.

## Notes

- Quiz state is stored in React hooks (client-side, not persisted)
- No database integration—questions are seeded in API routes
- User answers are collected and forwarded to your external API
- Results page shows only confirmation; scoring is handled by external API
- Timer tracking is available in metadata for analytics

## Future Enhancements

- Quiz timer/countdown
- Question review screen before submission
- Question shuffling
- Weighted scoring
- Image/media support in questions
- Accessibility improvements (WCAG AAA)

## License

MIT
