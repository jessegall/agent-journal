from argparse import Namespace

from journal.console.command import Command
from journal.support.where import Where
from journal.engine.machine import Machine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.support.scope import Scope


class NothingCommand(Command):
    """journal nothing "<why>": the agent decided nothing needs to survive this mark."""

    noun = "nothing"

    def __init__(self, machine: Machine, scope: Scope, agents: Agents) -> None:
        self.machine, self.scope, self.agents = machine, scope, agents

    def arguments(self, verbs) -> None:
        self.verb(verbs, "survives", "say why nothing needs recording").add_argument("why")

    def survives(self, args: Namespace, where: Where) -> int:
        MemoryCommand.decided(self, where)
        print("noted; carry on")
        return 0
