import re

from features import trigger
from features.base import Feature, event
from engine.transcript import last_said
from resources.base import AGENT

DEFERS = re.compile(r"\b(I'?ll (do|get to|come back to|handle|look at) (that|it|this)|after this|once (the|this|that) \w+ (is|are|finishes|lands)|next,? I'?ll|later on|I'?ll come back)\b", re.IGNORECASE)


RECENT = 200


class Deferral(Feature):
    name = "deferral"
    title_ = "Catching work put off"
    abstract_ = "Work put off in words, with no to-do parked, is named back to the agent once"
    help_ = "A sentence like 'I'll do that after this' is the title of a to-do; file it immediately before the reply or next implementation."
    trigger = {"on": trigger.IDLE}

    def parked_since(self, record, when: float) -> bool:
        return any(e.actor == AGENT and e.type == "todo" and e.action == "created" and e.at >= when for e in record.events(last=RECENT))

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        said = last_said(record, agent)
        found = DEFERS.search(said or "")
        if found and not self.parked_since(record, float(agent.at or 0) - 600):
            self.nudge(record, agent, "work deferred in words, not parked", f"\"{found.group(0)}\" is the title of a to-do: journal todo create \"<title>\" --brief, then say so")
