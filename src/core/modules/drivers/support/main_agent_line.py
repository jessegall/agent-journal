from engine.command.context import Context
from core.base.driver.nudge import Nudge
from engine.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.support.nudger import Nudger


class MainAgentLine:
    """Gives the running main agent of an environment a line at its next hook, typed to it if it sits idle."""

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def send(self, text: str, source: str, context: Context) -> None:
        for agent in MainAgentFinder.rows(self.queries):
            self.nudger.send_text(agent.id, text, source, context, wakes_agent=True)

    def send_nudge(self, nudge: Nudge, source: str, context: Context) -> None:
        for agent in MainAgentFinder.rows(self.queries):
            self.nudger.send_nudge(agent.id, nudge, source, context, wakes_agent=True)
