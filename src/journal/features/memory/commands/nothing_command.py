from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.environments import Environments


class NothingCommand(Command):
    """journal nothing "<why>": the agent decided nothing needs to survive this mark."""

    noun = "nothing"

    def __init__(self, environments: Environments, machine: Machine) -> None:
        self.environments, self.machine = environments, machine

    def arguments(self, verbs) -> None:
        self.verb(verbs, "survives", "say why nothing needs recording").add_argument("why")

    def survives(self, args: Namespace, where: Where) -> int:
        MemoryCommand.decided(self, where)
        print("noted; carry on")
        return 0
