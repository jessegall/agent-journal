from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import JOURNAL_PROGRAM
from suites.coding.modules.workers.support.worker_nudges import WORKER_JUDGE_SCOPE

JOURNAL_JUDGE = "sins"
SCOPING_FLAGS = ("--changes", "--branch")


class WorkerJudgeScopeRule(DriverRule):
    """A worker judges only its own changes: judging a folder or the whole tree takes minutes and shares the machine
    with the other runs. The main agent keeps the full judge."""

    name = "workers.worker-judge-scope"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.*"]
    roles = [CodingHelperRole.WORKER]
    refuses_one_action = "A worker judges only its own changes"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None and any(self.is_unscoped_judge(part) for part in tool.shell.parts):
            return RuleAnswer.refused(WORKER_JUDGE_SCOPE.nudge())
        return RuleAnswer.allowed()

    def is_unscoped_judge(self, part: Part) -> bool:
        first_argument = part.arguments[0] if part.arguments else ""
        return part.program == JOURNAL_PROGRAM and first_argument == JOURNAL_JUDGE and not any(argument.startswith(SCOPING_FLAGS) for argument in part.arguments)
