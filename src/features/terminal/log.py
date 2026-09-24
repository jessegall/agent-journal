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
JOURNAL_FOLDER = re.compile(r"(^|[\s'\"=/])\.journal(/|\s|$)")


def capped(text: str) -> str:
    lines = text[:MOST_CHARS].splitlines()
    hidden = text.count("\n") + 1 - min(len(lines), MOST_LINES)
    kept = "\n".join(lines[:MOST_LINES])
    return f"{kept}\n… {hidden} more lines" if hidden > 0 else kept


def journals_own(line: CommandRan) -> bool:
    command = line.command.strip()
    return line.tool == SHELL and bool(JOURNAL_CALL.match(CHANGED_FOLDER.sub("", command)) or JOURNAL_FOLDER.search(command))


def kept(record, session: str, line: CommandRan) -> None:
    if journals_own(line):
        return
    with record.state(LOG, session).changing() as held:
        held["lines"] = [*held.get("lines", []), {**asdict(line), "output": capped(line.output.strip())}][-KEPT:]


def lines(record, session: str) -> list[dict]:
    return record.state(LOG, session).get("lines", [])
