"""An expectation said in words: what a registration is given and what it then does, for the Settings page and for the skill the agent reads.

The expectation is the contract the suite plays, so the words are made from the expectation itself and never written beside it.
"""

import re
from dataclasses import fields, is_dataclass

from events.answers import Allowed, Kept as Withheld, Refused as Declined, Rewritten
from expects import (Answered, Changed, Dispatches, Expectation, File, Formats, Given, Held, Kept, Nudged, Nothing, Outcome, Printed, Ran, Refused, Remembered, Removed, Set,
                     Unchanged, Updated, Whispered, Wrote)

SHOWN = 90
FIELDS = 4
ROWS = 3
ENGINE_FIELDS = {"id", "cause", "claim", "trigger", "spacing"}


def humanly(name: str) -> str:
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", name).lower()


def clipped(text) -> str:
    text = " ".join(str(text).split())
    return text if len(text) <= SHOWN else text[: SHOWN - 1] + "…"


def quoted(text) -> str:
    return f'"{clipped(text)}"'


def stated_fields(thing) -> str:
    """The fields of a dataclass that carry something, as name and value, the engine's own left out."""
    if not is_dataclass(thing):
        return ""
    shown = [f"{one.name} {clipped(getattr(thing, one.name))}" for one in fields(thing)
             if one.name not in ENGINE_FIELDS and getattr(thing, one.name) not in ("", 0, 0.0, None, (), [], {}, False)]
    return ", ".join(shown[:FIELDS])


def thing_words(thing) -> str:
    """A row, a fact or a request: what kind it is and what it carries."""
    kind = humanly(type(thing).__name__)
    carried = stated_fields(thing)
    return f"{kind} ({carried})" if carried else kind


def on_words(on) -> str:
    if isinstance(on, str):
        return f"the text {quoted(on)}"
    if isinstance(on, tuple):
        controller, *arguments = on
        return f"the {humanly(getattr(controller, '__name__', str(controller)))} command" + (f" with {clipped(', '.join(map(str, arguments)))}" if arguments else "")
    if is_dataclass(on):
        return thing_words(on)
    return clipped(getattr(on, "shell_command", None) or getattr(on, "text", None) or humanly(type(on).__name__))


def rows_words(rows) -> str:
    named = [f"{humanly(type(row).__name__)} {clipped(getattr(row, 'title', '') or getattr(row, 'n', ''))}".strip() for row in rows]
    more = f" and {len(named) - ROWS} more" if len(named) > ROWS else ""
    return ", ".join(named[:ROWS]) + more


def given_words(given: Given) -> str:
    parts = [on_words(given.on)]
    if given.rows:
        parts.append(f"with {rows_words(given.rows)}")
    if given.settings:
        parts.append("with " + ", ".join(f"{name} {clipped(value)}" for name, value in list(given.settings.items())[:FIELDS]))
    return " ".join(parts)


def answer_words(answer) -> str:
    if isinstance(answer, Declined):
        return f"refuses it: {quoted(answer.why)}"
    if isinstance(answer, Allowed):
        return "lets it go on"
    if isinstance(answer, Rewritten):
        return f"rewrites it to {quoted(answer.text)}"
    if isinstance(answer, Withheld):
        return "keeps it out of the chat"
    return f"answers {thing_words(answer) if is_dataclass(answer) else quoted(answer)}"


def outcome_words(one: Outcome) -> str:
    if isinstance(one, Dispatches):
        return "dispatches nothing" if isinstance(one.fact, Nothing) else f"dispatches {thing_words(one.fact)}"
    if isinstance(one, Wrote):
        return f"writes the file {one.row.path}" if isinstance(one.row, File) else f"writes {thing_words(one.row)}"
    if isinstance(one, Updated):
        return f"changes {humanly(type(one.row).__name__)}" + (f" ({', '.join(f'{name} {clipped(value)}' for name, value in one.changed[:FIELDS])})" if one.changed else "")
    if isinstance(one, Removed):
        return f"removes the file {one.file.path}"
    if isinstance(one, Printed):
        return f"prints {quoted(one.text)}"
    if isinstance(one, Ran):
        return f"runs {quoted(' '.join(map(str, one.argv)))}"
    if isinstance(one, Refused):
        return f"refuses: {quoted(one.why)}"
    if isinstance(one, Changed):
        return f"changes the text to {quoted(one.text)}"
    if isinstance(one, Kept):
        return "lets it go on as it is"
    if isinstance(one, Unchanged):
        return "changes nothing"
    if isinstance(one, Formats):
        return f"turns {quoted(one.text)} into {quoted(one.to)}"
    if isinstance(one, Nudged):
        return f"nudges the agent ({one.line})"
    if isinstance(one, Whispered):
        return f"whispers {quoted(one.words)} to the agent"
    if isinstance(one, Held):
        return f"holds the agent's writes: {quoted(one.why)}"
    if isinstance(one, Answered):
        return answer_words(one.answer)
    if isinstance(one, Remembered):
        return f"remembers {one.key}"
    if isinstance(one, Set):
        return f"sets {humanly(type(one).__name__)}"
    return humanly(type(one).__name__)


def said(expectation: Expectation) -> str:
    """Given what a registration meets, then what it does."""
    return f"given {given_words(expectation.given)}, then {' and '.join(outcome_words(one) for one in expectation.outcomes.each)}"
