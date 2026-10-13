import json
import re
import types

from declaring import trigger
from declaring.details import Behaviour, Line
from declaring.trigger import Trigger
from events import Fact
from events.agents import AgentMessageSent, AgentReported, ToolCallAnswered
from expects import Dispatches, Given, Nudged, nothing
from receiving import Handler, Listener
from resources.base import KEYWORDS, KEYWORDS_IN, WHOM
from resources.marks import Whisper
from resources.text import plural
from resources.types import AgentRow
from serving import Chat, Clock, ReadElsewhere, ReadRows, Rows, Settings

WHISPER = "whisper"
WHISPERED_LAW = "whispered-law"

LINES = [
    Line(
        name=WHISPER,
        # The row's own words are the title, and the reference goes under them: a title is capped at 80, so a line that
        # spends eleven of those on "fact 55 — " clips the end off any title longer than sixty-nine.
        title="{{title}}",
        brief="{{type}} {{n}}",
        while_waiting=False,
    ),
    Line(
        name=WHISPERED_LAW,
        # A law's words are a sentence, not a title, and a title is capped at 80: so the words go in the brief,
        # where nothing caps them, and the title names which law it is. No part of a ruling is ever clipped.
        title="{{type}} {{n}}",
        brief="{{title}}",
        while_waiting=False,
    ),
    Line(
        name="standing",
        title="{{count}} standing, read them",
        brief="{{rows}}",
        while_waiting=False,
    ),
]

def whispering(noun: str) -> list[Behaviour]:
    return [
        Behaviour(
            name=WHISPER,
            title=f"Repeat a {noun} when one of its words appears",
            trigger=Trigger(every=100, unit=trigger.USES),
        ),
    ]


TEXT, COMMANDS, BOTH, EVERYTHING = "text", "commands", "both", "everything"
SCOPES = (TEXT, COMMANDS, BOTH, EVERYTHING)


def searched(call, scope: str) -> str:
    parts = {TEXT: call.writings, COMMANDS: call.commands, BOTH: (*call.commands, *call.writings)}.get(scope)
    return call.text if parts is None else " ".join(part for part in parts if part)


def mentioned(words, text: str) -> bool:
    """Whether a word stands in the text as a whole word, a flag's leading hyphens included, so force catches --force but not enforce or --force-with-lease."""
    return any(re.search(rf"(?<!\w){re.escape(str(word))}(?![\w-])", text, re.IGNORECASE) for word in words if word)


KEPT_WHISPERS = 50


def whisper_words(ref: str) -> str:
    return f"Reminded the agent of {ref.replace(':', ' ')}"


def strings_in(value) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, dict):
        value = list(value.values())
    if not isinstance(value, list):
        return []
    return [text for part in value for text in strings_in(part)]


def answered_words(event: ToolCallAnswered, scope: str) -> str:
    """The words of an answered call a keyword is looked for in: what it writes for text, its shell command for commands, both for both, and every string it carries for everything."""
    if scope == EVERYTHING:
        return event.command or " ".join(strings_in(json.loads(event.input)))
    commands = (event.command,) if event.command else ()
    return " ".join({TEXT: event.writings, COMMANDS: commands, BOTH: (*commands, *event.writings)}[scope])


def mentions(rows, agent: int, mentioned_fact: type, text_of) -> list[Fact]:
    """Each standing row whose keywords came up, once to the agent for as long as its words stay the same."""
    return [mentioned_fact(agent=agent, n=row.n, title=row.title).once(f"{agent}|{row.ref}:{row.title}|{row.brief}")
            for row in rows.rows.standing() if mentioned(row.data.get(KEYWORDS) or [], text_of(row.data.get(KEYWORDS_IN) or BOTH))]


class SpotKeywordInCall(Listener[ToolCallAnswered]):
    def __init__(self, resource: type, mentioned_fact: type):
        self.resource, self.mentioned_fact = resource, mentioned_fact

    def listen(self, event: ToolCallAnswered, settings: Settings, elsewhere: ReadElsewhere) -> list[Fact]:
        if event.why or event.subagent or not settings.is_on(WHISPER):
            return []
        return mentions(elsewhere.here().rows(self.resource), event.agent, self.mentioned_fact, lambda scope: answered_words(event, scope))


class SpotKeywordInChat(Listener[AgentMessageSent]):
    def __init__(self, resource: type, mentioned_fact: type):
        self.resource, self.mentioned_fact = resource, mentioned_fact

    def listen(self, event: AgentMessageSent, settings: Settings, elsewhere: ReadElsewhere) -> list[Fact]:
        if not settings.is_on(WHISPER):
            return []
        return mentions(elsewhere.here().rows(self.resource), event.agent, self.mentioned_fact, lambda scope: "" if scope == COMMANDS else event.text)


class SpotStanding(Listener[AgentReported]):
    def __init__(self, resource: type, standing_fact: type):
        self.resource, self.standing_fact = resource, standing_fact

    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], elsewhere: ReadElsewhere) -> list[Fact]:
        session = agents.peek(event.agent).title
        rows = [row for row in elsewhere.here().rows(self.resource).rows.standing() if row.data.get(WHOM, session) == session]
        return [self.standing_fact(agent=event.agent, count=plural(len(rows), self.resource.type), rows="; ".join(f"{row.n}. {row.title}" for row in rows)).due()] if rows else []


class WhisperTheRow:
    """Whispers a row its keywords brought up, and keeps it on the agent's row among what it was whispered."""

    def __init__(self, resource: type):
        self.resource = resource

    def handle(self, event: Fact, chat: Chat, agents: Rows[AgentRow], clock: Clock) -> list[Fact]:
        ref = f"{self.resource.type}:{event.n}"
        chat.remind(WHISPER, type=self.resource.type, n=event.n, title=event.title)
        agents.appended(agents.peek(event.agent), "whispers", Whisper(ref=ref, title=event.title, words=whisper_words(ref), at=clock.now()).as_data(), KEPT_WHISPERS)
        return []


class SayTheStanding:
    """Says the standing rows that bind the agent."""

    def handle(self, event: Fact, chat: Chat) -> list[Fact]:
        chat.say("standing", count=event.count, rows=event.rows)
        return []


def bound(base: type, fact: type) -> type:
    """A handler of one feature's own fact, built over the recital's shared one."""
    return types.new_class(base.__name__, (base, Handler[fact]))


WORKING = AgentRow(n=1, title="claude-1", data={"status": "working"})


def standing_row(controller: type):
    """One standing row of whichever kind this recital is for, so the same expectations are played for a fact, a rule and a reminder alike."""
    return controller.resource(n=4, title="The browser scenarios run the built viewer")


def keyed_row(controller: type, scope: str = BOTH):
    """A standing row that is whispered when the word deploy comes up, in what the agent does, says or both."""
    return controller.resource(n=4, title="Deploy only after the gate passes", brief="Run the gate first.", data={KEYWORDS: ["deploy"], KEYWORDS_IN: scope})


def answered(command: str) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool="Bash", input=command, command=command)


def edited(path: str, text: str) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool="Edit", input=json.dumps({"file_path": path, "new_string": text}), paths=(path,), writings=(text,))


def sent(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn="turn-1")


def register_recital(journal, controller: type, mentioned_fact: type, standing_fact: type) -> None:
    """The recital of one kind of standing row, as each of facts, rules and reminders registers it, with its own two facts."""
    resource, kind = controller.resource, controller.resource.type
    keyed = keyed_row(controller)
    whispered = mentioned_fact(agent=1, n=4, title=keyed.title).once(f"1|{kind}:4:{keyed.title}|{keyed.brief}")
    journal.events.listen(ToolCallAnswered, SpotKeywordInCall(resource, mentioned_fact), expects=[
        Given(answered("make deploy"), rows=(WORKING, keyed)) >> Dispatches(whispered),
        Given(answered("make deploy"), rows=(WORKING, keyed_row(controller, TEXT))) >> Dispatches(nothing),
        Given(answered("make build"), rows=(WORKING, keyed)) >> Dispatches(nothing),
        Given(answered("make undeploy"), rows=(WORKING, keyed)) >> Dispatches(nothing),
        Given(answered("make deploy"), rows=(WORKING,)) >> Dispatches(nothing),
        Given(edited("notes.md", "deploy after the gate"), rows=(WORKING, keyed)) >> Dispatches(whispered),
        Given(edited("deploy.md", "the gate first"), rows=(WORKING, keyed)) >> Dispatches(nothing),
        Given(answered("make deploy"), rows=(WORKING, keyed_row(controller, COMMANDS))) >> Dispatches(whispered),
        Given(edited("deploy.md", "the gate first"), rows=(WORKING, keyed_row(controller, EVERYTHING))) >> Dispatches(whispered),
    ])
    journal.events.listen(AgentMessageSent, SpotKeywordInChat(resource, mentioned_fact), expects=[
        Given(sent("I will deploy now"), rows=(WORKING, keyed)) >> Dispatches(whispered),
        Given(sent("I will deploy now"), rows=(WORKING, keyed_row(controller, COMMANDS))) >> Dispatches(nothing),
        Given(sent("I will deploy now"), rows=(WORKING, keyed_row(controller, TEXT))) >> Dispatches(whispered),
        Given(sent("I will deploy now"), rows=(WORKING, keyed_row(controller, EVERYTHING))) >> Dispatches(whispered),
        Given(sent("I will build now"), rows=(WORKING, keyed)) >> Dispatches(nothing),
        Given(sent("I will deploy now"), rows=(WORKING,)) >> Dispatches(nothing),
    ])
    journal.events.handle(mentioned_fact, bound(WhisperTheRow, mentioned_fact)(resource), expects=[
        Given(mentioned_fact(agent=1, n=4, title=keyed.title), rows=(WORKING, keyed)) >> Nudged(WHISPER),
    ])
    standing = standing_row(controller)
    journal.events.listen(AgentReported, SpotStanding(resource, standing_fact), expects=[
        Given(AgentReported(agent=1), rows=(WORKING, standing)) >> Dispatches(standing_fact(agent=1, count=plural(1, kind), rows=f"4. {standing.title}").due()),
        Given(AgentReported(agent=1), rows=(WORKING,)) >> Dispatches(nothing),
        Given(AgentReported(agent=1), rows=(WORKING, controller.resource(n=5, title="For another session", data={WHOM: "claude-2"}))) >> Dispatches(nothing),
        Given(AgentReported(agent=1), rows=(WORKING, standing, controller.resource(n=5, title="For another session", data={WHOM: "claude-2"})))
            >> Dispatches(standing_fact(agent=1, count=plural(1, kind), rows=f"4. {standing.title}").due()),
    ])
    journal.events.handle(standing_fact, bound(SayTheStanding, standing_fact)(), expects=[
        Given(standing_fact(agent=1, count=plural(1, kind), rows=f"4. {standing.title}"), rows=(WORKING,)) >> Nudged("standing", rows=f"4. {standing.title}"),
    ])
