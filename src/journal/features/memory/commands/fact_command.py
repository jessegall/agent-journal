from journal.engine.state_machine import StateMachine
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.memory_context import MemoryContext
from journal.repositories.facts import Facts
from journal.support.scope import Scope


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, machine: StateMachine, scope: Scope, agents: Agents, context: MemoryContext) -> None:
        super().__init__(machine, scope, agents, context)
        self.repository = facts
