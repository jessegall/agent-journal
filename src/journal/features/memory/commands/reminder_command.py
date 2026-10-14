from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.environments import Environments
from journal.repositories.reminders import Reminders


class ReminderCommand(MemoryCommand):
    noun = "reminder"

    def __init__(self, reminders: Reminders, environments: Environments, machine: Machine) -> None:
        super().__init__(environments, machine)
        self.repository = reminders
