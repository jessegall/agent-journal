from pathlib import Path

from engine.record import RESOURCES
from migrations.m0012_designs_become_docs import rewrite
from resources.types import TYPES


def run(root: Path) -> str:
    docs = Path(root) / RESOURCES / "doc"
    moved = {}
    for path in sorted(docs.glob("*.md")) if docs.is_dir() else []:
        if not path.is_file() or not path.stat().st_size:
            continue
        head = TYPES["doc"].load(path.read_text())
        numbers = head.data.get("revisions")
        if not isinstance(numbers, list):
            continue
        folder = docs / "revisions" / f"{head.n:03d}"
        folder.mkdir(parents=True, exist_ok=True)
        for k, n in enumerate(numbers, 1):
            source = docs / f"{int(n):03d}.md"
            if not source.is_file():
                continue
            page = TYPES["doc"].load(source.read_text())
            page.n, page.refs = head.n, [ref for ref in page.refs if ref != head.ref]
            page.data = {"revision": k, "change": page.data.get("change", "")}
            (folder / f"{k:03d}.md").write_text(page.dump())
            source.unlink()
            moved[f"doc:{int(n)}"] = head.ref
        head.data["revisions"] = len(numbers)
        path.write_text(head.dump())
    (docs / "index.json").unlink(missing_ok=True)
    changed = rewrite(Path(root), moved)
    return f"{len(moved)} revisions moved inside their docs; {changed} files point at the docs now"
