import type { Question } from '../types';

type RawAlternative = {
  letter: string;
  text: string;
};

type RawQuestion = {
  index: number;
  year: number;
  language: string | null;
  discipline: string;
  context: string;
  alternativesIntroduction: string;
  correctAlternative: string;
  alternatives: RawAlternative[];
};

type QuestionFileContext = {
  keys(): string[];
  <T>(key: string): T;
};

type RequireWithContext = typeof require & {
  context(
    path: string,
    recursive: boolean,
    filter: RegExp
  ): QuestionFileContext;
};

export type QuestionSelectionOptions = {
  tema?: string;
  prova?: string | number;
  nivel?: string;
};

const DISCIPLINE_LABELS: Record<string, string> = {
  'ciencias-humanas': 'Ciências Humanas',
  'ciencias-natureza': 'Ciências da Natureza',
  linguagens: 'Linguagens',
  matematica: 'Matemática',
};

const questionFiles = (require as RequireWithContext).context(
  '../../public',
  true,
  /^\.\/*\d{4}\/questions\/.+\/details\.json$/
);

function getQuestionId(question: RawQuestion): number {
  const languageId =
    question.language === 'espanhol' ? 1 : question.language === 'ingles' ? 2 : 0;
  return question.year * 1_000_000 + question.index * 10 + languageId;
}

function mapQuestion(rawQuestion: RawQuestion): Question {
  const correctIndex = rawQuestion.alternatives.findIndex(
    (alternative) => alternative.letter === rawQuestion.correctAlternative
  );
  if (correctIndex < 0) {
    throw new Error(
      `Gabarito inválido na questão ${rawQuestion.index} do ENEM ${rawQuestion.year}`
    );
  }

  const prompt = [rawQuestion.context, rawQuestion.alternativesIntroduction]
    .filter(Boolean)
    .join('\n\n');

  return {
    id: getQuestionId(rawQuestion),
    materia: DISCIPLINE_LABELS[rawQuestion.discipline] ?? rawQuestion.discipline,
    tema: rawQuestion.discipline,
    prova: rawQuestion.year,
    pergunta: prompt,
    alternativas: rawQuestion.alternatives.map((alternative) => alternative.text),
    correta: correctIndex,
    explicacao: '',
  };
}

export const questions: Question[] = questionFiles
  .keys()
  .map((key) => mapQuestion(questionFiles<RawQuestion>(key)));

export function getRandomQuestion(
  options: QuestionSelectionOptions = {}
): Question | undefined {
  const candidates = questions.filter(
    (question) =>
      (options.tema === undefined || question.tema === options.tema) &&
      (options.prova === undefined || question.prova === options.prova) &&
      (options.nivel === undefined || question.nivel === options.nivel)
  );

  if (candidates.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function getQuestionById(id: number): Question | undefined {
  return questions.find((question) => question.id === id);
}
