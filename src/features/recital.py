import re
import time

from engine.events.agents import AgentReported
from engine.events.engine import AgentMessageSent
from features import trigger
from features.trigger import Trigger
from features.base import Behaviour, Line
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler, ToolInterceptor
from engine.gates import Runs
from resources.base import KEYWORDS, KEYWORDS_IN, WHOM
from engine.reach import Reach
from engine.wording import plural
from controllers.types import Agents

WHISPER = "whisper"

LINES = [
    Line(
        name=WHISPER,
        title="{{type}} {{n}} — {{title}}",
        brief="{{brief}}",
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
    return any(re.search(rf"(?<![\w-]){re.escape(str(word))}(?![\w-])", text, re.IGNORECASE) for word in words if word)


KEPT_WHISPERS = 50


def whisper_words(ref: str) -> str:
    return f"Reminded the agent of {ref.replace(':', ' ')}"


def recite(context: AgentContext, controller: type, text_of) -> None:
    rows = context.journal.get(controller)
    for row in rows.rows.standing():
        if not mentioned(row.data.get(KEYWORDS) or [], text_of(row.data.get(KEYWORDS_IN) or BOTH)) or not whisper_due(context, row.ref, f"{row.title}|{row.brief}"):
            continue
        context.agent.whisper(WHISPER, type=rows.type, n=row.n, title=row.title, brief=row.brief)
        context.journal.get(Agents).appended(context.agent.row, "whispers", {"at": time.time(), "ref": row.ref, "title": row.title, "words": whisper_words(row.ref)}, KEPT_WHISPERS)


class WhisperOnKeyword(ToolInterceptor):
    reach = Reach.MAIN
    runs = Runs.ASYNC

    def __init__(self, controller: type):
        self.controller = controller

    def intercept(self, context: AgentContext, call) -> str:
        if context.on(WHISPER):
            recite(context, self.controller, lambda scope: searched(call, scope))
        return ""


class WhisperOnKeywordInChat(Handler):
    def __init__(self, controller: type):
        self.controller = controller

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if context.on(WHISPER):
            recite(context, self.controller, lambda scope: "" if scope == COMMANDS else event.text)


def whisper_due(context: Context, ref: str, wording: str) -> bool:
    """A row is whispered once to a session, and again only when its words change."""
    return context.once(WHISPER, f"{ref}:{wording}")


class RepeatStanding(Handler):
    behaviour = WHOLE_FEATURE

    def __init__(self, controller: type):
        self.controller = controller

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        resources = context.journal.get(self.controller)
        rows = [r for r in resources.rows.standing() if r.data.get(WHOM, context.agent.session) == context.agent.session]
        if rows:
            context.agent.say("standing", count=plural(len(rows), resources.type),
                              rows="; ".join(f"{r.n}. {r.title}" for r in rows))


def register_recital(journal, controller: type) -> None:
    journal.agent.interceptor(WhisperOnKeyword(controller))
    journal.events.handler(WhisperOnKeywordInChat(controller))
    journal.events.handler(RepeatStanding(controller))
