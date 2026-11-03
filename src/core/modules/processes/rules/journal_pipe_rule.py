from core.modules.processes.support.process_nudges import CUT_JOURNAL_COMMAND
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.background_commands import JOURNAL

CUTTING_PROGRAMS = ("head", "tail", "cut", "grep", "sed", "awk")


class JournalPipeRule(DriverRule):
    """Refuses a journal command piped into a program that cuts its output."""

    name = "processes.journal-pipe"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        for part in shell.parts:
            if part.program == JOURNAL and part.pipe_target is not None and shell.parts[part.pipe_target].program in CUTTING_PROGRAMS:
                return RuleAnswer.refused(CUT_JOURNAL_COMMAND.nudge())
        return RuleAnswer.allowed()
