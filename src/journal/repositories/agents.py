from datetime import datetime, timedelta

from journal.models.agent import Agent
from journal.models.agent_role import AgentRole
from journal.support.missing_row import MissingRow
from journal.repositories.scoped_repository import ScopedRepository


class Agents(ScopedRepository[Agent]):
    model = Agent

    def current(self) -> Agent | None:
        responsive = [item for item in self.scoped() if item.state != "ended" and item.role == AgentRole.MAIN]
        return responsive[-1] if responsive else None

    def all_agents(self) -> list[Agent]:
        return self.global_matching()

    def main_agents(self) -> list[Agent]:
        return self.global_matching(role=AgentRole.MAIN)

    def main_scoped(self, environment_id: int) -> list[Agent]:
        return [item for item in self.global_matching(environment_id=environment_id, role=AgentRole.MAIN) if item.state != "ended"]

    def main_unended(self) -> list[Agent]:
        return [item for item in self.main_agents() if item.state != "ended"]

    def running_peers(self, agent: Agent) -> list[Agent]:
        if agent.role != AgentRole.MAIN:
            return []
        return [item for item in self.main_scoped(agent.environment_id) if item.session != agent.session and item.provider == agent.provider]

    def all_current(self) -> Agent | None:
        responsive = sorted((item for item in self.main_agents() if item.state != "ended"), key=lambda item: item.update_time)
        return responsive[-1] if responsive else None

    def with_state(self, name: str) -> list[Agent]:
        return self.matching(state=name)

    def global_state(self, name: str) -> list[Agent]:
        return self.global_matching(state=name)

    def session_agent(self, session: str) -> Agent:
        rows = self.global_matching(session=session)
        if not rows:
            raise MissingRow(self.table, session)
        return rows[0]

    def recent_peers(self, session: str | None, start: datetime) -> list[Agent]:
        return [item for item in self.scoped() if item.session != session and item.update_time >= start and not (item.state == "ended" and item.update_time - item.creation_time < timedelta(minutes=1))]
