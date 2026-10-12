"""Lines held for an agent's next tool call, handed over beside the hook's answer rather than over the session channel the user sees."""

from engine import runtime

HELD = "held-lines.txt"


def keep(record, session: str, line: str) -> None:
    path = runtime.session_file(record.root, session, HELD)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as held:
        held.write(f"{line}\n")


def taken(record, session: str) -> list[str]:
    """The lines held for the session, forgotten as they are taken."""
    path = runtime.session_file(record.root, session, HELD)
    if not path.is_file():
        return []
    lines = [line for line in path.read_text().splitlines() if line.strip()]
    path.unlink(missing_ok=True)
    return lines
