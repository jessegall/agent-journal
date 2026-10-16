from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.facts import Facts
from journal.repositories.scope import Scope


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, machine: Machine, scope: Scope) -> None:
        super().__init__(machine, scope)
        self.repository = facts
