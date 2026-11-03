from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.support.worker_nudges import WORKER_JUDGE_SCOPE

UNSCOPED_JUDGE_PATTERN = r"(commandments-release judge|journal sins)(?!.*--(changes|branch))"


class WorkerJudgeScopeRule(DriverRule):
    """A worker judges only its own changes: judging a folder or the whole tree takes minutes and shares the machine
    with the other runs. The main agent keeps the full judge."""

    name = "workers.worker-judge-scope"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.*"]
    roles = [AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None and tool.shell.part_matches(UNSCOPED_JUDGE_PATTERN):
            return RuleAnswer.refused(WORKER_JUDGE_SCOPE.nudge())
        return RuleAnswer.allowed()
