from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer

JOURNAL = "journal"
CUTTING_PROGRAMS = ("head", "tail", "cut", "grep", "sed", "awk")
REFUSAL = "do not cut a journal command with a pipe: use its flags, such as journal output read N --lines A-B"


class JournalPipeRule(DriverRule):
    """Refuses a journal command piped into a program that cuts its output."""

    name = "processes.journal-pipe"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        for part in shell.parts:
            if part.program == JOURNAL and part.pipe_target is not None and shell.parts[part.pipe_target].program in CUTTING_PROGRAMS:
                return RuleAnswer.refused(REFUSAL)
        return RuleAnswer.allowed()
