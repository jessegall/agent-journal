from datetime import datetime, timedelta

from journal.models.agent import Agent
from journal.support.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def live(self) -> Agent | None:
        alive = [a for a in self.in_() if a.state != "ended"]
        return alive[-1] if alive else None

    def everywhere(self) -> list[Agent]:
        return self.across_environments()

    def live_everywhere(self) -> list[Agent]:
        return [a for a in self.across_environments() if a.state != "ended"]

    def live_in(self, environment_id: int) -> list[Agent]:
        return [a for a in self.across_environments(environment_id=environment_id) if a.state != "ended"]

    def others_running(self, session: str, environment_id: int, provider: str) -> list[Agent]:
        return [a for a in self.across_environments(environment_id=environment_id) if a.session != session and (a.provider or "claude") == (provider or "claude") and a.state != "ended"]

    def live_anywhere(self) -> Agent | None:
        alive = sorted((a for a in self.everywhere() if a.state != "ended"), key=lambda a: a.updated_at)
        return alive[-1] if alive else None

    def in_state(self, name: str) -> list[Agent]:
        return self.matching(state=name)

    def for_session(self, session: str) -> Agent:
        rows = self.across_environments(session=session)
        if not rows:
            raise NotFound(self.table, session)
        return rows[0]

    def others_lately(self, session: str, since: datetime) -> list[Agent]:
        return [a for a in self.in_() if a.session != session and a.updated_at >= since and not (a.state == "ended" and a.updated_at - a.created_at < timedelta(minutes=1))]
