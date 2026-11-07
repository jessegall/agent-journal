from pathlib import PurePath

from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import JOURNAL_PROGRAM
from suites.coding.modules.workers.support.worker_nudges import WORKER_JUDGE_SCOPE

JUDGE_PROGRAM = "commandments-release"
JUDGE_COMMAND = "judge"
JOURNAL_JUDGE = "sins"
SCOPING_FLAGS = ("--changes", "--branch")


class WorkerJudgeScopeRule(DriverRule):
    """A worker judges only its own changes: judging a folder or the whole tree takes minutes and shares the machine
    with the other runs. The main agent keeps the full judge."""

    name = "workers.worker-judge-scope"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.*"]
    roles = [AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None and any(self.is_unscoped_judge(part) for part in tool.shell.parts):
            return RuleAnswer.refused(WORKER_JUDGE_SCOPE.nudge())
        return RuleAnswer.allowed()

    def is_unscoped_judge(self, part: Part) -> bool:
        first_argument = part.arguments[0] if part.arguments else ""
        journal_judge = part.program == JOURNAL_PROGRAM and first_argument == JOURNAL_JUDGE
        plugin_judge = PurePath(part.program).name == JUDGE_PROGRAM and first_argument == JUDGE_COMMAND
        return (journal_judge or plugin_judge) and not any(argument.startswith(SCOPING_FLAGS) for argument in part.arguments)
