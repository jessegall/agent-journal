from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.reminders import Reminders
from journal.repositories.scope import Scope


class ReminderCommand(MemoryCommand):
    noun = "reminder"

    def __init__(self, reminders: Reminders, machine: Machine, scope: Scope) -> None:
        super().__init__(machine, scope)
        self.repository = reminders
