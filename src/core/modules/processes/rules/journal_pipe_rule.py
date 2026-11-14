from core.modules.processes.support.process_nudges import CUT_JOURNAL_COMMAND
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.registry.registry import Registry
from engine.subcommand.subcommand import is_subcommand_class
from core.modules.processes.support.background_commands import JOURNAL

CUTTING_PROGRAMS = ("head", "tail", "cut", "grep", "sed", "awk")


class JournalPipeRule(DriverRule):
    """Refuses a journal command piped into a program that cuts its output, unless the command allows pipes."""

    name = "processes.journal-pipe"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    single_action_refusal = "Refuses a journal command piped into a program that cuts its output"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        for part in shell.parts:
            if part.program == JOURNAL and part.pipe_target is not None and shell.parts[part.pipe_target].program in CUTTING_PROGRAMS and not self.allows_pipes(part):
                return RuleAnswer.refused(CUT_JOURNAL_COMMAND.nudge())
        return RuleAnswer.allowed()

    def allows_pipes(self, part: Part) -> bool:
        subcommand = self.registry.subcommands.get(" ".join(part.arguments[:2]))
        if subcommand is None:
            return False
        loaded = subcommand.loaded()
        return is_subcommand_class(loaded) and loaded.allows_pipes
