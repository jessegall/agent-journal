import re
from pathlib import Path

from engine.attic import pack
from engine.record import RESOURCES
from resources.base import Resource
from resources.types import TYPES

REF = re.compile(r"\bdesign:(\d+)\b")


def heads(designs: Path, docs: Path) -> dict[str, str]:
    moved, k = {}, max((int(p.stem) for p in docs.glob("*.md") if p.stem.isdigit()), default=0)
    for path in sorted(designs.glob("*.md")):
        if not path.stat().st_size:
            continue
        design = Resource.load(path.read_text())
        k += 1
        doc = TYPES["doc"](**{**vars(design), "n": k, "data": {**design.data, "open_until": 0}})
        (docs / f"{k:03d}.md").write_text(doc.dump())
        moved[f"design:{design.n}"] = f"doc:{k}"
    return moved


def rewrite(root: Path, moved: dict[str, str]) -> int:
    changed = 0
    for path in [*(root / RESOURCES).rglob("*.md"), *(root / "environments").rglob("*.md")]:
        text = path.read_text()
        now = REF.sub(lambda m: moved.get(m.group(0), m.group(0)), text)
        if now != text:
            path.write_text(now)
            changed += 1
    return changed


def run(root: Path) -> str:
    root = Path(root)
    designs, docs = root / RESOURCES / "design", root / RESOURCES / "doc"
    if not designs.is_dir():
        return "no designs to fold into docs"
    docs.mkdir(parents=True, exist_ok=True)
    moved = heads(designs, docs)
    changed = rewrite(root, moved)
    (docs / "index.json").unlink(missing_ok=True)
    pack(designs, "design")
    return f"{len(moved)} designs became docs with their revisions; {changed} files point at them now"
