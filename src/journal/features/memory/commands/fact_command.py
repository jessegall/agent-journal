from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.environments import Environments
from journal.repositories.facts import Facts


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, environments: Environments, machine: Machine) -> None:
        super().__init__(environments, machine)
        self.repository = facts
