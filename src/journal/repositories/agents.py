from journal.models.agent import Agent
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def for_session(self, session: str) -> Agent: ...
