const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function apiUploadFile(file: File): Promise<{ doc_id: string; source: string; chars: number; preview: string }>{
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/api/upload/`, { method: 'POST', body: fd });
  return asJson(res);
}

export async function apiSummarize(docId: string, maxWords = 250): Promise<{ summary: string }>{
  const res = await fetch(`${API_BASE}/api/summarize/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_id: docId, max_words: maxWords })
  });
  return asJson(res);
}

export async function apiFlashcards(docId: string, count = 10): Promise<{ flashcards: { question: string; answer: string }[] }>{
  const res = await fetch(`${API_BASE}/api/flashcards/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_id: docId, count })
  });
  return asJson(res);
}

export async function apiQuiz(docId: string, count = 5): Promise<{ questions: { question: string; options: string[]; correct_index: number }[] }>{
  const res = await fetch(`${API_BASE}/api/quiz/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doc_id: docId, count })
  });
  return asJson(res);
}


