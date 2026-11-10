from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.overview.support.overview_first import OverviewFirst


class OverviewCompactionRule(DriverRule):
    """A compaction blocks the agent until it has run journal overview, so the session start that follows it
    already tells the agent nothing else."""

    name = "overview.overview-after-compaction"
    hook = HookEventName.COMPACT
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, first: OverviewFirst) -> None:
        self.first = first

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(self.first.block(hook.agent_id)) if self.first.is_required else RuleAnswer.allowed()
