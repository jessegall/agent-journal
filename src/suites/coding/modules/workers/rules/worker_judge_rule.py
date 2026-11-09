from pathlib import PurePath

from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import JOURNAL_PROGRAM
from suites.coding.modules.workers.support.worker_nudges import WORKER_JUDGE_REFUSED

JUDGE_PROGRAM = "commandments-release"
JUDGE_COMMAND = "judge"
JOURNAL_JUDGE = "sins"


class WorkerJudgeRule(DriverRule):
    """A worker never runs the judge, in any form: the journal judges its work at each hand-in and again at the merge.
    The main agent keeps the judge."""

    name = "workers.worker-judge"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.*"]
    roles = [CodingHelperRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None and any(self.is_judge(part) for part in tool.shell.parts):
            return RuleAnswer.refused(WORKER_JUDGE_REFUSED.nudge())
        return RuleAnswer.allowed()

    def is_judge(self, part: Part) -> bool:
        first_argument = part.arguments[0] if part.arguments else ""
        journal_judge = part.program == JOURNAL_PROGRAM and first_argument == JOURNAL_JUDGE
        plugin_judge = PurePath(part.program).name == JUDGE_PROGRAM and first_argument == JUDGE_COMMAND
        return journal_judge or plugin_judge
