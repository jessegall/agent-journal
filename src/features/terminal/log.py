import re
from dataclasses import asdict

from engine.events import CommandRan
from engine.ran import SHELL
from features.status_bar.commands import JOURNAL_CALL

LOG = "terminal"
KEPT = 200
MOST_LINES = 60
MOST_CHARS = 4000
CHANGED_FOLDER = re.compile(r"^cd\s+\S+\s*&&\s*")


def capped(text: str) -> str:
    lines = text[:MOST_CHARS].splitlines()
    hidden = text.count("\n") + 1 - min(len(lines), MOST_LINES)
    kept = "\n".join(lines[:MOST_LINES])
    return f"{kept}\n… {hidden} more lines" if hidden > 0 else kept


def journal_call(line: CommandRan) -> bool:
    return line.tool == SHELL and bool(JOURNAL_CALL.match(CHANGED_FOLDER.sub("", line.command.strip())))


def kept(record, session: str, line: CommandRan) -> None:
    if journal_call(line):
        return
    with record.state(LOG, session).changing() as held:
        held["lines"] = [*held.get("lines", []), {**asdict(line), "output": capped(line.output.strip())}][-KEPT:]


def lines(record, session: str) -> list[dict]:
    return record.state(LOG, session).get("lines", [])
