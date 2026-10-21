from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.engine.state_machine import StateMachine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.support.scope import Scope


class MemorySkipCommand(Command):
    """journal memory skip "<why>": the agent decided nothing needs recording at this mark."""

    noun = "memory"

    def __init__(self, machine: StateMachine, scope: Scope, agents: Agents) -> None:
        self.machine, self.scope, self.agents = machine, scope, agents

    def arguments(self, verbs) -> None:
        self.verb(verbs, "skip", "say why nothing needs recording").add_argument("why")

    def skip(self, args: Namespace, caller: Caller) -> int:
        MemoryCommand.decided(self, caller)
        print("noted; carry on")
        return 0
