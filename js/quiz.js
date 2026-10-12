/* Self-test logic. Pure; the quiz and flashcard screens live in tools.js. */

export function scoreQuiz(answers, questions) {
  const correct = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  return { correct, total: questions.length };
}

export const questionsFor = (quiz, stage) => quiz.filter(q => q.stage === stage);

export function cardsFor(terms, stages, stage) {
  const s = stages.find(x => x.n === stage);
  if (!s) return [];
  const nums = new Set(s.chapters.map(id => Number(id.slice(2))));
  return terms.filter(t => nums.has(t.chapter));
}
