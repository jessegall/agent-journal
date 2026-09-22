from pathlib import Path

LOOSE = ("largest-result-*.json", "touched-*.json", "refused-*.json", "skills-required-*.json", "tagged-*.json", "untagged-*.json", "shown-*.json",
         "greeted-*.json", "bar-*.json", "browser-*.json", "updates.json", "already.lock")


def run(root: Path) -> str:
    runtime = Path(root) / "runtime"
    gone = [f for pattern in LOOSE for f in runtime.glob(pattern) if f.is_file()]
    gone += [f for home in (Path(root) / "environments").glob("*/runtime") for f in [*home.glob("files-*.json"), *home.glob("files-*.lock"), home / "changes.json"] if f.is_file()]
    for f in gone:
        f.unlink(missing_ok=True)
    return f"feature state moved into the record: {len(gone)} old runtime files removed"
