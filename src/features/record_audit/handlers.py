from events.agents import ClockTicked
from resources.text import plural
from features.record_audit.audit import evidence
from framework.parts import WHOLE_FEATURE, AgentContext, Handler


class SayEvidence(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        found = evidence(context.record)
        if found:
            context.agent.say("evidence", count=plural(len(found), "thing"),
                              found="; ".join(f"{f.ref} {f.evidence} — {f.retire}" for f in found))
