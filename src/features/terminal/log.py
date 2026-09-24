import re
from dataclasses import asdict

from engine.events import CommandRan
from engine.ran import DELIVERED, NOTED, SHELL, TYPED
from features.status_bar.commands import JOURNAL_CALL

LOG = "terminal"
COMMANDS, JOURNAL, EVERYTHING = "commands", "journal", "everything"
LEVELS = (COMMANDS, JOURNAL, EVERYTHING)
KEPT = 200
MOST_LINES = 60
MOST_CHARS = 4000
SLACK = 20
CHANGED_FOLDER = re.compile(r"^cd\s+\S+\s*&&\s*")
JOURNAL_FOLDER = re.compile(r"(^|[\s'\"=/])\.journal(/|\s|$)")


def capped(text: str) -> str:
    lines = text.splitlines()
    if len(lines) <= MOST_LINES + SLACK and len(text) <= MOST_CHARS:
        return text
    kept = text[:MOST_CHARS].splitlines()[:MOST_LINES]
    return "\n".join([*kept, f"… {len(lines) - len(kept)} more lines were not kept"])


def journals_own(line: CommandRan) -> bool:
    command = line.command.strip()
    return line.tool == SHELL and bool(JOURNAL_CALL.match(CHANGED_FOLDER.sub("", command)) or JOURNAL_FOLDER.search(command))


def level_of(line: CommandRan) -> str:
    if line.tool in (TYPED, NOTED):
        return COMMANDS
    if line.tool == DELIVERED:
        return JOURNAL
    if line.tool == SHELL:
        return JOURNAL if journals_own(line) else COMMANDS
    return EVERYTHING


def kept(record, session: str, line: CommandRan) -> None:
    level = level_of(line)
    with record.state(f"{LOG}-{level}", session).changing() as held:
        held["lines"] = [*held.get("lines", []), {**asdict(line), "output": capped(line.output.strip()), "level": level}][-KEPT:]


def lines(record, session: str, level: str) -> list[dict]:
    included = LEVELS[:LEVELS.index(level) + 1]
    return sorted((line for name in included for line in record.state(f"{LOG}-{name}", session).get("lines", [])), key=lambda line: line["at"])[-KEPT:]
