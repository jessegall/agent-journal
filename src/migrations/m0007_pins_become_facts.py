import json
from pathlib import Path
from engine.stored import write_text

WAS, NOW = "pin", "fact"
TEXT = (".md", ".json", ".jsonl")


def moved(text: str) -> str:
    return text.replace(f'"type": "{WAS}"', f'"type": "{NOW}"').replace(f'"{WAS}:', f'"{NOW}:')


def run(root: Path) -> str:
    root = Path(root)
    folders = rows = touched = 0
    for home in sorted(p for p in (root / "environments").glob("*") if p.is_dir()):
        old = home / WAS
        if not old.is_dir():
            continue
        new = home / NOW
        new.mkdir(exist_ok=True)
        for entry in (entry for entry in sorted(old.iterdir()) if not (new / entry.name).exists()):
            entry.rename(new / entry.name)
            rows += (new / entry.name).is_file()
        if not any(old.iterdir()):
            old.rmdir()
            folders += 1
        for f in sorted(home.rglob("*")):
            if not f.is_file() or f.suffix not in TEXT or f.parent.name == "runtime":
                continue
            text = f.read_text()
            rewritten = moved(text)
            if rewritten != text:
                write_text(f, rewritten)
                touched += 1
    for f in sorted((root / "runtime").glob("gate-*.json")):
        try:
            holds = json.loads(f.read_text())
        except (OSError, ValueError):
            continue
        write_text(f, json.dumps({(NOW if k == WAS else k): v for k, v in holds.items()}))
    return f"{rows} pins became facts in {folders} environments, {touched} files repointed"
