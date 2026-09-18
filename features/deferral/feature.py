import re

from features import trigger
from features.base import Feature, on
from features.tags.feature import last_said
from resources.base import AGENT, SYSTEM

DEFERS = re.compile(r"\b(I'?ll (do|get to|come back to|handle|look at) (that|it|this)|after this|once (the|this|that) \w+ (is|are|finishes|lands)|next,? I'?ll|later on|I'?ll come back)\b", re.IGNORECASE)


class Deferral(Feature):
    name = "deferral"
    title_ = "Deferral"
    abstract_ = "Work put off in words, with no to-do parked, is named back to the agent once"
    help_ = "A sentence like 'I'll do that after this' is the title of a to-do; park it before the reply goes out."
    trigger = {"on": trigger.IDLE}

    def parked_since(self, record, when: float) -> bool:
        return any(e.actor == AGENT and e.type == "todo" and e.action == "created" and e.at >= when for e in record.events())

    @on("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        said = last_said(record, agent)
        found = DEFERS.search(said or "")
        if found and not self.parked_since(record, float(agent.data.get("at") or 0) - 600):
            self.nudge(record, agent, "work deferred in words, not parked", f"\"{found.group(0)}\" is the title of a to-do: journal todo add \"<title>\" --brief, then say so")
