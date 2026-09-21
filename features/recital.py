from engine.events import AgentUpdated
from engine.stored import read_json, write_json
from features import trigger
from features.trigger import Trigger
from features.base import Behaviour, Line
from features.parts import WHOLE_FEATURE, Context, Handler, ToolInterceptor
from resources.base import KEYWORDS, WHOM

WHISPER = "whisper"

LINES = [
    Line(
        name=WHISPER,
        title="{{type}} {{n}} — {{title}}",
        brief="{{brief}}",
    ),
    Line(
        name="standing",
        title="{{count}} standing, read them",
        brief="{{rows}}",
    ),
]

BEHAVIOURS = [
    Behaviour(
        name=WHISPER,
        title="Whisper a row when one of its keywords appears",
        abstract="Said again once this many of the agent's tool uses have passed since it last spoke",
        trigger=Trigger(every=50, unit=trigger.USES),
    ),
]


class WhisperOnKeyword(ToolInterceptor):
    def __init__(self, resources: str):
        self.resources = resources

    def intercept(self, context: Context, call) -> str:
        text = call.text.lower()
        if not text or not context.agent or not context.on(WHISPER):
            return ""
        rows = getattr(context.journal, self.resources)
        for row in rows._standing():
            words = [w for w in row.data.get(KEYWORDS) or [] if w and str(w).lower() in text]
            if words and whisper_due(context, row.ref):
                context.agent.whisper(WHISPER, type=rows.type, n=row.n, title=row.title, brief=row.brief)
        return ""


def whisper_due(context: Context, ref: str) -> bool:
    f = context.record.root / "runtime" / f"touched-{context.agent.session}.json"
    last_uses, uses = read_json(f, {}), int(context.agent.row.uses or 0)
    every = context.feature.cadence(context.record, WHISPER).every
    if ref in last_uses and uses - int(last_uses[ref] or 0) < float(every):
        return False
    write_json(f, {**last_uses, ref: uses})
    return True


class RepeatStanding(Handler):
    behaviour = WHOLE_FEATURE

    def __init__(self, resources: str):
        self.resources = resources

    def handle(self, context: Context, event: AgentUpdated) -> None:
        resources = getattr(context.journal, self.resources)
        rows = [r for r in resources._standing() if r.data.get(WHOM, context.agent.session) == context.agent.session]
        if rows:
            context.agent.say("standing", count=context.feature.plural(len(rows), resources.type),
                              rows="; ".join(f"{r.n}. {r.title}" for r in rows))
