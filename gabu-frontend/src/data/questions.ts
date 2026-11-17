import type { Question } from '../types';

type RawAlternative = {
  letter: string;
  text: string;
  file?: string | null;
};

type RawQuestion = {
  title?: string;
  index: number;
  year: number;
  language: string | null;
  discipline: string;
  context: string | null;
  alternativesIntroduction: string | null;
  explanation?: string | null;
  correctAlternative: string;
  alternatives: RawAlternative[] | null;
  files?: string[] | null;
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
  excludeId?: number;
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

const questionImageFiles = (require as RequireWithContext).context(
  '../../public',
  true,
  /^\.\/*\d{4}\/questions\/.+\/[^/]+\.(?:png|jpe?g|webp)$/i
);

function normalizeContextKey(key: string): string {
  return key.replace(/\\/g, '/').replace(/^\.\//, '');
}

const localImageAssets = new Map(
  questionImageFiles
    .keys()
    .map((key) => [normalizeContextKey(key), questionImageFiles<number>(key)])
);

function getLocalImage(
  questionFileKey: string,
  imageReference: string | null | undefined
): number | null {
  if (!imageReference) return null;

  const imagePath = imageReference.split(/[?#]/)[0];
  const fileName = imagePath.slice(imagePath.lastIndexOf('/') + 1);
  if (!/\.(?:png|jpe?g|webp)$/i.test(fileName)) return null;

  const questionDirectory = normalizeContextKey(questionFileKey)
    .replace(/\/details\.json$/, '');
  return localImageAssets.get(`${questionDirectory}/${fileName}`) ?? null;
}

function getQuestionId(question: RawQuestion): number {
  const languageId =
    question.language === 'espanhol' ? 1 : question.language === 'ingles' ? 2 : 0;
  return question.year * 1_000_000 + question.index * 10 + languageId;
}

function mapQuestion(
  rawQuestion: RawQuestion,
  fileKey: string
): Question | null {
  if (!rawQuestion.alternatives || rawQuestion.alternatives.length !== 5) {
    console.warn(
      `Questão ignorada: ${fileKey} não possui cinco alternativas válidas.`
    );
    return null;
  }

  const correctIndex = rawQuestion.alternatives.findIndex(
    (alternative) => alternative.letter === rawQuestion.correctAlternative
  );
  if (correctIndex < 0) {
    console.warn(
      `Questão ignorada: gabarito inválido em ${fileKey}.`
    );
    return null;
  }

  const context = (rawQuestion.context ?? '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .trim();

  return {
    id: getQuestionId(rawQuestion),
    numero: rawQuestion.index,
    titulo: rawQuestion.title ?? `Questão ${rawQuestion.index} - ENEM ${rawQuestion.year}`,
    materia: DISCIPLINE_LABELS[rawQuestion.discipline] ?? rawQuestion.discipline,
    tema: rawQuestion.discipline,
    prova: rawQuestion.year,
    contexto: context,
    pergunta: rawQuestion.alternativesIntroduction?.trim() ?? '',
    alternativas: rawQuestion.alternatives.map((alternative) => alternative.text),
    imagens: (rawQuestion.files ?? [])
      .map((file) => getLocalImage(fileKey, file))
      .filter((image): image is number => image !== null),
    imagensAlternativas: rawQuestion.alternatives.map((alternative) =>
      getLocalImage(fileKey, alternative.file)
    ),
    correta: correctIndex,
    explicacao: rawQuestion.explanation ?? '',
  };
}

export const questions: Question[] = questionFiles
  .keys()
  .map((key) => mapQuestion(questionFiles<RawQuestion>(key), key))
  .filter((question): question is Question => question !== null);

const questionsById = new Map(questions.map((question) => [question.id, question]));

export const QUESTION_DISCIPLINES = Object.entries(DISCIPLINE_LABELS).map(
  ([id, label]) => ({ id, label })
);

export function getDisciplineLabel(id: string): string {
  return DISCIPLINE_LABELS[id] ?? id;
}

export function getRandomQuestion(
  options: QuestionSelectionOptions = {}
): Question | undefined {
  const matchingQuestions = questions.filter(
    (question) =>
      (options.tema === undefined || question.tema === options.tema) &&
      (options.prova === undefined || question.prova === options.prova) &&
      (options.nivel === undefined || question.nivel === options.nivel)
  );

  const alternatives = options.excludeId === undefined
    ? matchingQuestions
    : matchingQuestions.filter((question) => question.id !== options.excludeId);
  const candidates = alternatives.length > 0 ? alternatives : matchingQuestions;

  if (candidates.length === 0) return undefined;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function getQuestionById(id: number): Question | undefined {
  return questionsById.get(id);
}
