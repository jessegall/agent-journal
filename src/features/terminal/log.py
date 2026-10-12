import re
from dataclasses import asdict, fields

from events import Fact
from events.agents import CommandRan
from engine.ran import DELIVERED, NOTED, SHELL, TYPED
from framework.command_effects import JOURNAL_CALL

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


def kept_under(level: str, session: str) -> str:
    return f"{level}|{session}"


def kept(memory, session: str, line: CommandRan) -> None:
    """Keeps the command in the session's log of its level, the command's own fields only."""
    level, own = level_of(line), {field.name for field in fields(Fact)}
    entry = {**{key: value for key, value in asdict(line).items() if key not in own}, "output": capped(line.output.strip()), "level": level}
    memory.set(kept_under(level, session), [*memory.get(kept_under(level, session), []), entry][-KEPT:])


def lines(record, session: str, level: str, after: float = 0.0) -> list[dict]:
    included = LEVELS[:LEVELS.index(level) + 1]
    found = (line for name in included for line in record.state(LOG).get(kept_under(name, session), []) if line["at"] > after)
    return sorted(found, key=lambda line: line["at"])[-KEPT:]
