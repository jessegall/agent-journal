import shutil
from pathlib import Path

from engine.record import RESOURCES

REVISIONS = "revisions"


def run(root: Path) -> str:
    docs = Path(root) / RESOURCES / "doc"
    if not docs.is_dir():
        return "no docs yet"
    old = docs / REVISIONS
    numbers = sorted({p.stem for p in docs.glob("[0-9]*.md")} | ({p.name for p in old.iterdir() if p.is_dir()} if old.is_dir() else set()))
    for number in numbers:
        home = docs / number
        home.mkdir(exist_ok=True)
        loose = docs / f"{number}.md"
        if loose.is_file():
            loose.rename(home / "doc.md")
        kept = old / number
        if kept.is_dir():
            (home / REVISIONS).mkdir(exist_ok=True)
            for revision in sorted(kept.glob("*.md")):
                revision.rename(home / REVISIONS / revision.name)
            shutil.rmtree(kept)
    if old.is_dir() and not any(old.iterdir()):
        old.rmdir()
    (docs / "index.json").unlink(missing_ok=True)
    return f"docs moved into folders of their own: {len(numbers)}"
