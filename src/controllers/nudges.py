from controllers.base import Controller
from resources import types
from resources.base import SYSTEM


class Nudges(Controller):
    resource = types.Nudge

    def to_primary(self, title: str, brief: str = "", **data):
        from controllers.agents import Agents
        agent = Agents(self.record, actor=SYSTEM).primary()
        return self.create(title, brief=brief, session=agent.title, **data) if agent else None
