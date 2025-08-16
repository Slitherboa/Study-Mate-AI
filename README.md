# StudyMate Backend (Django + DRF)

## Setup
```bash
cd studymate_backend
python -m venv .venv
. .venv/Scripts/Activate.ps1  # on Windows PowerShell
pip install -U pip
pip install -r requirements.txt
```

Copy env:
```bash
cd ..
copy .env.example .env
```

Run:
```bash
cd studymate_backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## API
Base: http://localhost:8000/api/

Endpoints:
- POST /api/upload/
- POST /api/summarize/
- POST /api/flashcards/
- POST /api/quiz/
- POST /api/explain/

## cURL Quick Test
```bash
# Upload text
curl -X POST http://localhost:8000/api/upload/ -H "Content-Type: application/json" -d '{"text":"This is a sample document long enough to be useful."}'

# Summarize
curl -X POST http://localhost:8000/api/summarize/ -H "Content-Type: application/json" -d '{"doc_id":"<UUID>", "max_words": 200}'

# Flashcards
curl -X POST http://localhost:8000/api/flashcards/ -H "Content-Type: application/json" -d '{"doc_id":"<UUID>", "count": 10}'

# Quiz
curl -X POST http://localhost:8000/api/quiz/ -H "Content-Type: application/json" -d '{"doc_id":"<UUID>", "count": 5}'

# Explain
curl -X POST http://localhost:8000/api/explain/ -H "Content-Type: application/json" -d '{"doc_id":"<UUID>", "selection":"neural networks", "level":"kid"}'
```
