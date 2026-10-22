from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.threshold_decisions import ThresholdDecisions
from journal.features.memory.support.memory_context import MemoryContext
from journal.repositories.reminders import Reminders


class ReminderCommand(MemoryCommand):
    noun = "reminder"

    def __init__(self, reminders: Reminders, decisions: ThresholdDecisions, context: MemoryContext) -> None:
        super().__init__(decisions, context)
        self.repository = reminders
