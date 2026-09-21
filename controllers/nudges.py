from controllers.base import Controller
from resources import types
from resources.base import SYSTEM


class Nudges(Controller):
    resource = types.Nudge

    def _to_primary(self, title: str, brief: str = ""):
        from controllers.agents import Agents
        agent = Agents(self.record, actor=SYSTEM).primary()
        return self.create(title, brief=brief, session=agent.title) if agent else None

    def _whispered(self, session: str) -> str:
        mine = [n for n in self.unread() if n.private and n.session == session]
        for n in mine:
            self.read(n.n)
        return "\n".join(dict.fromkeys(f"{n.title}{' — ' + n.brief if n.brief else ''}" for n in mine))
