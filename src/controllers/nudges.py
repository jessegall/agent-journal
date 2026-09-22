from controllers.base import Controller
from resources import types
from resources.base import SYSTEM


class Nudges(Controller):
    resource = types.Nudge

    def _to_primary(self, title: str, brief: str = ""):
        from controllers.agents import Agents
        agent = Agents(self.record, actor=SYSTEM).primary()
        return self.create(title, brief=brief, session=agent.title) if agent else None
