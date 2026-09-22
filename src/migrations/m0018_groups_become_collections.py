from pathlib import Path

from migrations.m0012_designs_become_docs import rewrite


def run(root: Path) -> str:
    root, moved = Path(root), {}
    for old in sorted((root / "environments").glob("*/group")):
        numbers = [int(p.stem) for p in old.glob("*.md") if p.stem.isdigit()]
        new = old.with_name("collection")
        if new.exists():
            continue
        (old / "index.json").unlink(missing_ok=True)
        old.rename(new)
        moved.update({f"group:{n}": f"collection:{n}" for n in numbers})
    changed = rewrite(root, moved)
    return f"groups are collections: {len(moved)} rows moved, {changed} files point at them now"
