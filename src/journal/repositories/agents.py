from datetime import datetime, timedelta

from journal.models.agent import Agent
from journal.repositories.not_found import NotFound
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def live(self) -> Agent | None:
        """The latest agent here whose session has not ended."""
        alive = [a for a in self.in_() if a.state != "ended"]
        return alive[-1] if alive else None

    def everywhere(self) -> list[Agent]:
        """Every agent in every environment, for what the whole project hears, such as a check's result or a change of voice."""
        return self.across_environments()

    def in_state(self, name: str) -> list[Agent]:
        return self.where(state=name)

    def for_session(self, session: str) -> Agent:
        """The agent of a session, in whichever environment: a session is the project's own."""
        found = self.across_environments(session=session)
        if not found:
            raise NotFound(self.table, session)
        return found[0]

    def others_lately(self, session: str, since: datetime) -> list[Agent]:
        """The other sessions that worked here since: a launch that ended within a minute of starting did no work and is not one."""
        return [a for a in self.in_() if a.session != session and a.updated_at >= since and not (a.state == "ended" and a.updated_at - a.created_at < timedelta(minutes=1))]
