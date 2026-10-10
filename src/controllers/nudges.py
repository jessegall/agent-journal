from controllers.base import Controller
from resources import types
from resources.base import SYSTEM, Refused


LOOKED_BACK = 20


class Nudges(Controller):
    resource = types.Nudge

    def to_primary(self, title: str, brief: str = "", **data):
        from controllers.agents import Agents
        agent = Agents(self.record, actor=SYSTEM).primary()
        return self.create(title, brief=brief, session=agent.title, **data) if agent else None

    def settle(self, n: int, how: str = "") -> None:
        """Closes a nudge that is still open; one that another thread closed first is left as it is."""
        try:
            self.complete(n, how=how)
        except Refused:
            if not self.load(n).completed:
                raise

    def _repeats_last(self, session: str, title: str, brief: str, agent_at: float) -> bool:
        """Whether the last line said to this session was this very line and the agent has done nothing since, so that saying it again would add nothing."""
        for row in reversed(self.rows.summaries()[-LOOKED_BACK:]):
            last = self.load(row["n"]) if not row["deleted"] else None
            if last is not None and last.data.get("session") == session:
                return not last.completed and last.title == title and last.brief == brief and last.created > agent_at
        return False
