from pathlib import Path

EXCLUDED = "/.journal"


def excluded(top: Path) -> None:
    gitdir = Path((top / ".git").read_text().split(":", 1)[1].strip())
    exclude = (gitdir if gitdir.is_absolute() else top / gitdir).resolve().parents[1] / "info" / "exclude"
    held = exclude.read_text() if exclude.is_file() else ""
    if EXCLUDED not in held.splitlines():
        exclude.parent.mkdir(parents=True, exist_ok=True)
        exclude.write_text(held + ("" if not held or held.endswith("\n") else "\n") + EXCLUDED + "\n")
