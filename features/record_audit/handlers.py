from engine.events import AgentUpdated
from features.record_audit.audit import evidence
from features.parts import WHOLE_FEATURE, AgentContext, Handler


class SayEvidence(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: AgentUpdated) -> None:
        found = evidence(context.record)
        if found:
            context.agent.say("evidence", count=context.feature.plural(len(found), "thing"),
                              found="; ".join(f"{f['ref']} {f['evidence']} — {f['retire']}" for f in found))
