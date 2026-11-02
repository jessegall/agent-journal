from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.block_until import BlockUntil
from core.base.driver.conditions.ran_command import RanCommand
from core.base.driver.rule_answer import RuleAnswer
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.overview.support.overview_nudges import OVERVIEW_REFUSAL

OVERVIEW_COMMAND = "journal overview"


class OverviewFirstRule(DriverRule):
    """A session's start or a compaction blocks the agent until it has run journal overview; a resume does not,
    since its conversation already holds it."""

    name = "overview.overview-first"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, first: OverviewFirst) -> None:
        self.first = first

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.first.is_required:
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(BlockUntil(hook.agent_id, OVERVIEW_REFUSAL.nudge(), RanCommand(OVERVIEW_COMMAND)))
