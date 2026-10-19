from journal.engine.machine import Machine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.reminders import Reminders
from journal.support.scope import Scope


class ReminderCommand(MemoryCommand):
    noun = "reminder"

    def __init__(self, reminders: Reminders, machine: Machine, scope: Scope, agents: Agents) -> None:
        super().__init__(machine, scope, agents)
        self.repository = reminders
