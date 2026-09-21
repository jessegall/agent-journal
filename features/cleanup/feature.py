from features import trigger
from features.base import Feature, event, Line
from features.cleanup.audit import evidence


class Cleanup(Feature):
    name = "cleanup"
    lines = {"evidence": Line("{{count}} in the record have evidence against them", "{{found}}")}
    title_ = "The record audit"
    abstract_ = "What in the record has evidence against it — a file that is gone, a command that does not exist, a row waiting on the user too long — said to the agent once a day"
    help_ = "Each finding names the row, what is wrong with it, and the command that retires it."
    trigger = {"every": 1440, "unit": trigger.MINUTES}

    @event("agent.updated")
    def report(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        found = evidence(record)
        if found:
            self.journal.say(record, agent, "evidence", count=self.plural(len(found), "thing"),
                     found="; ".join(f"{f['ref']} {f['evidence']} — {f['retire']}" for f in found))
