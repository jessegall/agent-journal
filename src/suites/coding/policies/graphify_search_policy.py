from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from suites.coding.support.graphify_searches import GRAPHIFY_SEARCH_KEY, GraphifySearches


class GraphifySearchPolicy(EventPolicy):
    """Past the block count, a search of the code that does not use Graphify is refused until the agent uses it."""

    key = GRAPHIFY_SEARCH_KEY
    rank = "tools.policies"
    role_group = RoleGroup.PROMPT

    def __init__(self, searches: GraphifySearches) -> None:
        self.searches = searches

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.searches.answer(event, agent_id).refusal
