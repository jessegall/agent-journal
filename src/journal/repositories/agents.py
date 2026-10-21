from datetime import datetime, timedelta

from journal.models.agent import Agent
from journal.support.missing_row import MissingRow
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def current(self) -> Agent | None:
        alive = [a for a in self.scoped() if a.state != "ended"]
        return alive[-1] if alive else None

    def all_agents(self) -> list[Agent]:
        return self.global_matching()

    def environment_agents(self) -> list[Agent]:
        return [a for a in self.global_matching() if a.state != "ended"]

    def current_scoped(self, environment_id: int) -> list[Agent]:
        return [a for a in self.global_matching(environment_id=environment_id) if a.state != "ended"]

    def others_running(self, session: str, environment_id: int, provider: str) -> list[Agent]:
        return [a for a in self.global_matching(environment_id=environment_id) if a.session != session and (a.provider or "claude") == (provider or "claude") and a.state != "ended"]

    def all_current(self) -> Agent | None:
        alive = sorted((a for a in self.all_agents() if a.state != "ended"), key=lambda a: a.updated_at)
        return alive[-1] if alive else None

    def with_state(self, name: str) -> list[Agent]:
        return self.matching(state=name)

    def session_agent(self, session: str) -> Agent:
        rows = self.global_matching(session=session)
        if not rows:
            raise MissingRow(self.table, session)
        return rows[0]

    def others_lately(self, session: str, since: datetime) -> list[Agent]:
        return [a for a in self.scoped() if a.session != session and a.updated_at >= since and not (a.state == "ended" and a.updated_at - a.created_at < timedelta(minutes=1))]
