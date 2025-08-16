# StudyMate 

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

