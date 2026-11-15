from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from suites.coding.support.graphify_searches import GRAPHIFY_SEARCH_KEY, GraphifySearches


class GraphifySearchRule(DriverRule):
    """The old walk's answer for GraphifySearchPolicy and GraphifySearchLines, which own it, until the walk is deleted."""

    name = GRAPHIFY_SEARCH_KEY
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    single_action_refusal = "While the Graphify tool is on, an agent's searches of the project's code that do not use Graphify are counted"

    def __init__(self, searches: GraphifySearches) -> None:
        self.searches = searches

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.searches.answer(hook.event, hook.agent_id)
        if answer.refusal is not None:
            return RuleAnswer.refused(answer.refusal)
        return RuleAnswer.with_nudges(answer.nudge) if answer.nudge is not None else RuleAnswer.allowed()
