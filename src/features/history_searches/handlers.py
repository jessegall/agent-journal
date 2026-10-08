import time
from dataclasses import dataclass

from controllers.types import CONTROLLERS, Agents
from engine.events.engine import AgentMessageSent, CommandRan
from engine.journal_calls import PUNCTUATION, JournalCall, pieces
from engine.ran import SHELL
from engine.reach import Reach
from features.parts import AgentContext, Handler, ToolInterceptor
from engine.gates import Runs

TAKES_VALUE = {"--page", "--back"}
OPEN = "open"
OPENING = {"show", "read"}
FOUND_LIMIT, READ_LIMIT, KEPT_READS = 4000, 2000, 20


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


@dataclass(frozen=True)
class SearchMark:
    label: str
    title: str = ""


def mark(call: JournalCall) -> SearchMark | None:
    words = asked(call)
    noun, terms = (words[0], words[1:]) if words else ("", [])
    if noun == "search" and terms:
        return SearchMark("Searched the conversation", repr(" ".join(terms)))
    if noun in CONTROLLERS and terms[:1] == ["search"] and terms[1:]:
        return SearchMark(f"Searched {CONTROLLERS[noun].resource.details.title.lower()}s", repr(" ".join(terms[1:])))
    if noun == "conversation":
        return SearchMark("Read the conversation history", {0: "", 1: "before the last compaction"}.get(back(call), f"{back(call)} compactions back"))
    if noun == "user":
        return SearchMark("Searched your messages", "")
    return None


def searches(command: str) -> list[str]:
    if "journal" not in command:
        return []
    try:
        found = pieces(command)
    except ValueError:
        return []
    return [found_mark for call in map(journal_call, found) if call is not None and (found_mark := mark(call))]


class MarkHistorySearches(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.ASYNC

    def intercept(self, context: AgentContext, call) -> str:
        for command in call.commands:
            for found in searches(command):
                key = f"search-{time.time_ns()}"
                context.journal.get(Agents).card(context.agent.row.n, key=key, label=found.label, title=found.title, icon="search", tone="note")
                context.state.set(OPEN, key)
        return ""


def opened(event: CommandRan) -> str:
    if event.tool == "Read":
        return f"Read {event.command.rsplit(' ', 1)[-1]}"
    if event.tool != SHELL:
        return ""
    for piece in pieces(event.command):
        call = journal_call(piece)
        words = asked(call) if call else []
        if len(words) > 2 and words[1] in OPENING:
            return f"Opened {words[0]} {words[2]}"
    return ""


class KeepSearchResults(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        key = context.state.get(OPEN)
        agents = context.journal.get(Agents)
        if not key:
            return
        if event.tool == SHELL and searches(event.command):
            agents.card(context.agent.row.n, key=key, found=event.output[:FOUND_LIMIT])
            return
        label = opened(event)
        card = next((kept for kept in agents.load(context.agent.row.n).data.get("cards") or [] if kept.get("key") == key), None)
        if label and card:
            reads = [*card.get("reads", []), {"label": label, "text": event.output[:READ_LIMIT]}]
            agents.card(context.agent.row.n, key=key, reads=reads[:KEPT_READS])


class EndSearchReads(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        context.state.remove(OPEN)
