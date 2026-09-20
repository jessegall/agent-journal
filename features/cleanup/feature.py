from features import trigger
from features.base import Feature, event
from features.cleanup.query import evidence, read_owed


class Cleanup(Feature):
    name = "cleanup"
    title_ = "The record audit"
    abstract_ = "What in the record has evidence against it, said to the agent once a day; and the reading pass it owes"
    help_ = "cleanup lists claims naming a file that is gone or a verb the CLI lacks, and rows waiting on the user too long; cleanup read is every rule and pin in full."
    trigger = {"every": 1440, "unit": trigger.MINUTES}

    @event("agent.updated")
    def report(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        found = evidence(record)
        if found:
            self.nudge(record, agent, f"{self.plural(len(found), 'thing')} in the record have evidence against them — cleanup", "; ".join(f"{f['ref']} {f['evidence']}" for f in found))
        elif read_owed(record):
            self.nudge(record, agent, "the reading pass over every rule and pin is owed — cleanup read")
