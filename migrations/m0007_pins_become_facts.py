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
        if old.is_dir():
            new = home / NOW
            new.mkdir(exist_ok=True)
            for entry in sorted(old.iterdir()):
                target = new / entry.name
                if not target.exists():
                    entry.rename(target)
                    rows += entry.is_file()
            if not any(old.iterdir()):
                old.rmdir()
            folders += 1
        for f in sorted(home.rglob("*")):
            if not f.is_file() or f.suffix not in TEXT or f.parent.name == "runtime":
                continue
            text = f.read_text()
            said = moved(text)
            if said != text:
                write_text(f, said)
                touched += 1
    for f in sorted((root / "runtime").glob("gate-*.json")):
        try:
            holds = json.loads(f.read_text())
        except (OSError, ValueError):
            continue
        write_text(f, json.dumps({(NOW if k == WAS else k): v for k, v in holds.items()}))
    return f"{rows} pins became facts in {folders} environments, {touched} files repointed"
