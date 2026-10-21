from datetime import datetime, timedelta

from journal.models.agent import Agent
from journal.support.missing_row import MissingRow
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def current(self) -> Agent | None:
        responsive = [item for item in self.scoped() if item.state != "ended"]
        return responsive[-1] if responsive else None

    def all_agents(self) -> list[Agent]:
        return self.global_matching()

    def environment_agents(self) -> list[Agent]:
        return [item for item in self.global_matching() if item.state != "ended"]

    def current_scoped(self, environment_id: int) -> list[Agent]:
        return [item for item in self.global_matching(environment_id=environment_id) if item.state != "ended"]

    def running_peers(self, session: str, environment_id: int, provider: str) -> list[Agent]:
        return [item for item in self.global_matching(environment_id=environment_id) if item.session != session and (item.provider or "claude") == (provider or "claude") and item.state != "ended"]

    def all_current(self) -> Agent | None:
        responsive = sorted((item for item in self.all_agents() if item.state != "ended"), key=lambda item: item.updated_at)
        return responsive[-1] if responsive else None

    def with_state(self, name: str) -> list[Agent]:
        return self.matching(state=name)

    def session_agent(self, session: str) -> Agent:
        rows = self.global_matching(session=session)
        if not rows:
            raise MissingRow(self.table, session)
        return rows[0]

    def recent_peers(self, session: str, start: datetime) -> list[Agent]:
        return [item for item in self.scoped() if item.session != session and item.updated_at >= start and not (item.state == "ended" and item.updated_at - item.created_at < timedelta(minutes=1))]
