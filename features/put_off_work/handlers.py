import re

from engine.events import AgentUpdated
from engine.transcript import last_text
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from resources.base import AGENT

DEFERS = re.compile(r"\b(I'?ll (do|get to|come back to|handle|look at) (that|it|this)|after this|once (the|this|that) \w+ (is|are|finishes|lands)|next,? I'?ll|later on|I'?ll come back)\b", re.IGNORECASE)
RECENT = 200
SINCE = 600


class NameDeferredWork(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        found = DEFERS.search(last_text(context.record, context.agent.row) or "")
        if found and not self.parked_since(context, float(context.agent.row.at or 0) - SINCE):
            context.agent.say("deferred", words=found.group(0))

    def parked_since(self, context: Context, when: float) -> bool:
        return any(e.actor == AGENT and e.type == "todo" and e.action == "created" and e.at >= when for e in context.record.events(last=RECENT))
