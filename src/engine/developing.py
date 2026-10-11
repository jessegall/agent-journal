import os
from pathlib import Path
from engine.memo import Memo

READ = Memo()
DEVELOPING = "DEVELOPMENT_MODE"


def developing(project: Path) -> bool:
    value = os.environ.get(DEVELOPING, "") or declared(project / ".env")
    return value.strip().strip("'\"").lower() in ("1", "true", "yes", "on")


def declared(env: Path) -> str:
    try:
        mark = env.stat().st_mtime_ns
    except OSError:
        return ""
    return READ.get(str(env), mark, lambda: next((line.split("=", 1)[1] for line in env.read_text().splitlines() if line.strip().startswith(f"{DEVELOPING}=")), ""))


class AnsweredBlank(LookupError):
    """A read found nothing it was promised and said so, rather than handing back an empty value nobody can tell from a real one."""

    @classmethod
    def of(cls, what: str, asked, among=()) -> "AnsweredBlank":
        held = f"; it holds {', '.join(sorted(str(one) for one in among))}" if among else ""
        return cls(f"{what} has nothing for {asked!r}{held}. "
                   f"This is said rather than answered blank because the journal is developing itself here; "
                   f"elsewhere the empty answer stands.")


def found(project: Path, what: str, asked, among, value, blank=None):
    """What a read found, or a refusal naming what it reached for. Where the journal develops itself, a blank answer is a fault to see at once rather than a value that travels until it ruins something far away."""
    if value != blank or not developing(project):
        return value
    raise AnsweredBlank.of(what, asked, among)


JOURNAL_FOLDER = ".journal"


def project_of(path: Path) -> Path:
    """The project a journal file belongs to: the folder above the journal root that holds it, so a hook and the server ask the same question of the same file. A file under no journal root is asked of the folder the process runs in."""
    return next((one.parent for one in Path(path).parents if one.name == JOURNAL_FOLDER), Path.cwd())
