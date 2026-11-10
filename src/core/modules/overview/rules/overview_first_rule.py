from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.overview.support.overview_nudges import OVERVIEW_LINE


class OverviewFirstRule(DriverRule):
    """A session's start or a compaction tells the agent to run journal overview and blocks it until it has: nothing
    else passes but reading a skill. A resume does not, since its conversation already holds it."""

    name = "overview.overview-first"
    start_line_rule = True
    overlay_proof = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, first: OverviewFirst) -> None:
        self.first = first

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.first.is_required:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(OVERVIEW_LINE.nudge()).running(self.first.block(hook.agent_id))
