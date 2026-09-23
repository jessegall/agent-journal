import re
import time

from engine.events import AgentMessageSent, AgentReported
from features.base import Behaviour, Line
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler, ToolInterceptor
from resources.base import KEYWORDS, KEYWORDS_IN, WHOM

WHISPER = "whisper"

LINES = [
    Line(
        name=WHISPER,
        title="{{type}} {{n}} — {{title}}",
        while_waiting=False,
    ),
    Line(
        name="standing",
        title="{{count}} standing, read them",
        brief="{{rows}}",
        while_waiting=False,
    ),
]

BEHAVIOURS = [
    Behaviour(
        name=WHISPER,
        title="Whisper a row when one of its keywords appears",
        abstract="Its title, at most once per context window",
    ),
]


TEXT, COMMANDS, BOTH, EVERYTHING = "text", "commands", "both", "everything"
SCOPES = (TEXT, COMMANDS, BOTH, EVERYTHING)


def searched(call, scope: str) -> str:
    parts = {TEXT: (call.written,), COMMANDS: (call.command,), BOTH: (call.command, call.written)}.get(scope)
    return call.text if parts is None else " ".join(part for part in parts if part)


def mentioned(words, text: str) -> bool:
    return any(re.search(rf"(?<![\w-]){re.escape(str(word))}(?![\w-])", text, re.IGNORECASE) for word in words if word)


KEPT_WHISPERS = 50


def recite(context: AgentContext, resources: str, text_of) -> None:
    rows = getattr(context.journal, resources)
    for row in rows._standing():
        if mentioned(row.data.get(KEYWORDS) or [], text_of(row.data.get(KEYWORDS_IN) or BOTH)) and whisper_due(context, row.ref):
            context.agent.whisper(WHISPER, type=rows.type, n=row.n, title=row.title)
            kept = context.agent.row.data.get("whispers") or []
            context.journal.agents.update(context.agent.row.n, whispers=[*kept, {"at": time.time(), "ref": row.ref, "title": row.title}][-KEPT_WHISPERS:])


class WhisperOnKeyword(ToolInterceptor):
    def __init__(self, resources: str):
        self.resources = resources

    def intercept(self, context: AgentContext, call) -> str:
        if context.on(WHISPER):
            recite(context, self.resources, lambda scope: searched(call, scope))
        return ""


class WhisperOnKeywordInChat(Handler):
    def __init__(self, resources: str):
        self.resources = resources

    def handle(self, context: AgentContext, event: AgentMessageSent) -> None:
        if context.on(WHISPER):
            recite(context, self.resources, lambda scope: "" if scope == COMMANDS else event.text)


def whisper_due(context: Context, ref: str) -> bool:
    compactions = context.agent.row.data.get("compactions") or []
    window = str(compactions[-1]["at"]) if compactions else "start"
    told = context.state.get("told", {})
    said = told.get("refs", []) if told.get("window") == window else []
    if ref in said:
        return False
    context.state.set("told", {"window": window, "refs": [*said, ref]})
    return True


class RepeatStanding(Handler):
    behaviour = WHOLE_FEATURE

    def __init__(self, resources: str):
        self.resources = resources

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        resources = getattr(context.journal, self.resources)
        rows = [r for r in resources._standing() if r.data.get(WHOM, context.agent.session) == context.agent.session]
        if rows:
            context.agent.say("standing", count=context.feature.plural(len(rows), resources.type),
                              rows="; ".join(f"{r.n}. {r.title}" for r in rows))
