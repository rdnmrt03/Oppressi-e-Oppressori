from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'web'
FILES = ['index.html', 'online.html', 'style.css', 'online.css', 'app.js', 'engine.js', 'online-core.js', 'online.js', 'firebase-room.js', 'firebase-config.js']
OUTPUT.mkdir(exist_ok=True)
for name in FILES:
    shutil.copyfile(ROOT / name, OUTPUT / name)
print('Sito preparato in:', OUTPUT)
print('Pubblicare solo la cartella web; .tools e gli archivi non sono inclusi.')
