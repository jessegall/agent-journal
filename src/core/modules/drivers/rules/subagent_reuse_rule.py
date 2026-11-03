from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.path_mentions import PathMentions
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch
from core.modules.drivers.rules.dispatch_mark_rule import DEFAULT_PROFILE
from core.modules.drivers.support.driver_nudges import SUBAGENT_REUSE

INDEPENDENT_PROFILES = ("auditor", "reviewer", "plan-reviewer", "critic")


class SubagentReuseRule(DriverRule):
    """A new subagent whose job names files an ended one of the same profile worked on is refused, naming it to send
    the job to; a profile that must judge independently is left out."""

    name = "drivers.subagent-reuse"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.AGENT:
            return RuleAnswer.allowed()
        dispatch = hook.event.tool_input()
        profile = f"{dispatch.get('subagent_type') or DEFAULT_PROFILE}"
        paths = PathMentions.found(f"{dispatch.get('prompt', '')}")
        if not paths or profile in INDEPENDENT_PROFILES:
            return RuleAnswer.allowed()
        for row in self.queries.query(SubagentDispatch).filter(agent_id=hook.agent_id, profile=profile).newest().all_rows():
            if row.ended_at is not None and row.subagent_id is not None and PathMentions.shared(paths, PathMentions.found(row.instruction)):
                return RuleAnswer.refused(SUBAGENT_REUSE.nudge(agent=self.queries.query(Agent).find(row.subagent_id).session))
        return RuleAnswer.allowed()
