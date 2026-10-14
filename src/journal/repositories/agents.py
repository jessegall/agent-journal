from journal.models.agent import Agent
from journal.repositories.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def live(self, environment_id: int) -> Agent | None:
        """The latest agent here whose session has not ended."""
        alive = [a for a in self.in_(environment_id) if a.state != "ended"]
        return alive[-1] if alive else None

    def in_state(self, name: str) -> list[Agent]:
        return self.where(state=name)

    def for_session(self, session: str) -> Agent:
        found = self.where(session=session)
        if not found:
            raise NotFound(self.table, session)
        return found[0]
