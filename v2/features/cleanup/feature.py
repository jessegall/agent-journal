from v2.controllers.types import CONTROLLERS
from v2.features import trigger
from v2.features.base import Feature, on
from v2.features.cleanup.query import evidence, read_owed
from v2.resources.base import SYSTEM


class Cleanup(Feature):
    name = "cleanup"
    title_ = "Cleanup"
    abstract_ = "What in the record has evidence against it, said to the agent once a day; and the reading pass it owes"
    help_ = "cleanup lists claims naming a file that is gone or a verb the CLI lacks, and rows waiting on the user too long; cleanup read is every rule and pin in full."
    trigger = {"every": 1440, "unit": trigger.MINUTES}

    @on("agent.updated")
    def report(self, event, record) -> None:
        agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
        if not self.due(record, agent):
            return
        found = evidence(record)
        if found:
            self.nudge(record, agent, f"{len(found)} thing{'s' if len(found) > 1 else ''} in the record have evidence against them — cleanup", "; ".join(f"{f['ref']} {f['evidence']}" for f in found))
        elif read_owed(record):
            self.nudge(record, agent, "the reading pass over every rule and pin is owed — cleanup read")
