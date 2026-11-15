from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from suites.coding.support.graphify_searches import GRAPHIFY_SEARCH_KEY, GraphifySearches


class GraphifySearchLines(EventLineSource):
    """From the nudge count on, a search of the code that does not use Graphify tells the agent to use it."""

    key = GRAPHIFY_SEARCH_KEY
    events = [HookEventName.PRE_TOOL_USE]
    role_group = RoleGroup.PROMPT

    def __init__(self, searches: GraphifySearches) -> None:
        self.searches = searches

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        nudge = self.searches.answer(event, agent_id).nudge if event is not None else None
        return [nudge] if nudge is not None else []
