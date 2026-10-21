from journal.engine.support.session_agents import SessionAgents
from journal.repositories.agents import Agents
from journal.features.memory.commands.memory_command import MemoryCommand
from journal.features.memory.support.memory_context import MemoryContext
from journal.repositories.facts import Facts
from journal.repositories.scope import Scope


class FactCommand(MemoryCommand):
    noun = "fact"

    def __init__(self, facts: Facts, sessions: SessionAgents, scope: Scope, agents: Agents, context: MemoryContext) -> None:
        super().__init__(sessions, scope, agents, context)
        self.repository = facts
