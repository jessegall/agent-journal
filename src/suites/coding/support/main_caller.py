from core.base.command.context import Context
from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class MainCaller:
    """Tells whether a command comes from a main agent, as opposed to a person, a worker or a helper."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def is_main(self, context: Context) -> bool:
        return context.actor.id in MainAgentFinder.main_ids(self.queries, (context.actor.id,))
