import re

from controllers.types import Agents
from engine.journal_calls import PUNCTUATION, JournalCall, pieces
from engine.reach import Reach
from features.parts import AgentContext, ToolInterceptor

TAKES_VALUE = {"--page", "--back"}
REDIRECT = re.compile(r"\s\d*[<>]+&?\s*[^\s|;&]*")


def journal_call(piece: tuple[str, ...]) -> JournalCall | None:
    start = next((i for i, word in enumerate(piece) if word == "journal" or word.endswith("/journal")), None)
    return JournalCall(piece[start:]) if start is not None else None


def asked(call: JournalCall) -> list[str]:
    found, rest = [], list(call.rest)
    while rest:
        word = rest.pop(0)
        if word in TAKES_VALUE or set(word) <= set(PUNCTUATION):
            rest = rest[1:]
        elif not word.startswith("-"):
            found.append(word)
    return found


def back(call: JournalCall) -> int:
    given = [word.removeprefix("--back=") for word in call.rest if word.startswith("--back=")]
    given += [after for word, after in zip(call.rest, call.rest[1:]) if word == "--back"]
    return next((int(value) for value in given if value.isdigit()), 0)


def label(call: JournalCall) -> str:
    words = asked(call)
    noun, terms = (words[0], words[1:]) if words else ("", [])
    if noun == "search" and terms:
        return f"Searched the history for {' '.join(terms)!r}"
    if noun == "conversation":
        return {0: "Read back the conversation", 1: "Read back the conversation the last summary replaced"}.get(
            back(call), f"Read back the conversation {back(call)} summaries ago")
    if noun == "user":
        return "Read back your own words"
    return ""


def searches(command: str) -> list[str]:
    if "journal" not in command:
        return []
    try:
        found = pieces(REDIRECT.sub(" ", command))
    except ValueError:
        return []
    return [text for call in map(journal_call, found) if call is not None and (text := label(call))]


class MarkHistorySearches(ToolInterceptor):
    reach = Reach.MAIN
    refuses = False

    def intercept(self, context: AgentContext, call) -> str:
        for command in call.commands:
            for found in searches(command):
                context.journal.get(Agents).card(context.agent.row.n, label=found, icon="search", tone="note")
        return ""
