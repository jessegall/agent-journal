from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.memory.support.threshold_decisions import ThresholdDecisions


class MemorySkipCommand(Command):
    """journal memory skip "<why>": the agent decided nothing needs recording at this mark."""

    noun = "memory"

    def __init__(self, decisions: ThresholdDecisions) -> None:
        self.decisions = decisions

    def arguments(self, verbs) -> None:
        self.verb(verbs, "skip", "say why nothing needs recording").add_argument("why")

    def skip(self, args: Namespace, caller: Caller) -> int:
        self.decisions.decided(caller)
        print("noted; carry on")
        return 0
