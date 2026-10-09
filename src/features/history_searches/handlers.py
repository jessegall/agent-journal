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
WAITING = "waiting"
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
        return SearchMark(f'Searched the conversation for "{" ".join(terms)}"')
    if noun in CONTROLLERS and terms[:1] == ["search"] and terms[1:]:
        return SearchMark(f'Searched {CONTROLLERS[noun].resource.details.title.lower()}s for "{" ".join(terms[1:])}"')
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


def marked(context: AgentContext, command: str, found: str | None = None) -> list[str]:
    """One card for each search the command makes, with what it found once that is known; the keys are the cards'."""
    keys = []
    for one in searches(command):
        key = f"search-{time.time_ns()}"
        context.journal.get(Agents).card(context.agent.row.n, key=key, label=one.label, title=one.title, icon="search", tone="note",
                                         **({} if found is None else {"found": found[:FOUND_LIMIT]}))
        keys.append(key)
    if keys:
        context.state.set(OPEN, keys[-1])
    return keys


def labels(command: str) -> list[str]:
    return [one.label for one in searches(command)]


class MarkHistorySearches(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.ASYNC

    def intercept(self, context: AgentContext, call) -> str:
        for command in call.commands:
            if keys := marked(context, command):
                context.state.set(WAITING, [*(context.state.get(WAITING) or []), {"labels": labels(command), "keys": keys}])
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
        agents = context.journal.get(Agents)
        if event.tool == SHELL and searches(event.command):
            self.found(context, event)
            return
        key = context.state.get(OPEN)
        label = opened(event)
        card = next((kept for kept in agents.load(context.agent.row.n).data.get("cards") or [] if kept.get("key") == key), None) if key else None
        if label and card:
            reads = [*card.get("reads", []), {"label": label, "text": event.output[:READ_LIMIT]}]
            agents.card(context.agent.row.n, key=key, reads=reads[:KEPT_READS])

    def found(self, context: AgentContext, event: CommandRan) -> None:
        """What a search found goes to the cards of that search, whichever searches ran at the same time; a search whose marks are not there yet gets them now."""
        waiting = context.state.get(WAITING) or []
        mine = next((entry for entry in waiting if entry["labels"] == labels(event.command)), None)
        if mine is None:
            marked(context, event.command, event.output)
            return
        context.state.set(WAITING, [entry for entry in waiting if entry is not mine])
        context.state.set(OPEN, mine["keys"][-1])
        for key in mine["keys"]:
            context.journal.get(Agents).card(context.agent.row.n, key=key, found=event.output[:FOUND_LIMIT])


class EndSearchReads(Handler):
    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        context.state.remove(OPEN)
        context.state.remove(WAITING)
