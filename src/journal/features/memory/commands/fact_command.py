from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.threshold_decisions import ThresholdDecisions
from journal.features.memory.support.memory_context import MemoryContext
from journal.repositories.facts import Facts


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, decisions: ThresholdDecisions, context: MemoryContext) -> None:
        super().__init__(decisions, context)
        self.repository = facts
