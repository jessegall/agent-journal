from journal.models.agent import Agent
from journal.repositories.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def for_session(self, session: str) -> Agent:
        found = self.where(session=session)
        if not found:
            raise NotFound(self.table, session)
        return found[0]
