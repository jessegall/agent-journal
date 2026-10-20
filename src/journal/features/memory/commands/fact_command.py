from journal.engine.state_machine import StateMachine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.repositories.facts import Facts
from journal.support.scope import Scope


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, machine: StateMachine, scope: Scope, agents: Agents) -> None:
        super().__init__(machine, scope, agents)
        self.repository = facts
