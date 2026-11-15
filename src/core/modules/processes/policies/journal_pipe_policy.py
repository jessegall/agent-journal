from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.nudges.cut_journal_command_message import CutJournalCommandMessage
from engine.driver.part import Part
from engine.registry.registry import Registry
from engine.subcommand.subcommand import is_subcommand_class
from core.modules.processes.support.background_commands import JOURNAL

CUTTING_PROGRAMS = ("head", "tail", "cut", "grep", "sed", "awk")


class JournalPipePolicy(EventPolicy):
    """Refuses a journal command piped into a program that cuts its output, unless the command allows pipes."""

    key = "processes.journal-pipe"
    rank = "shell.all"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        for part in shell.parts:
            if part.program == JOURNAL and part.pipe_target is not None and shell.parts[part.pipe_target].program in CUTTING_PROGRAMS and not self.allows_pipes(part):
                return CutJournalCommandMessage.declared().nudge()
        return None

    def allows_pipes(self, part: Part) -> bool:
        subcommand = self.registry.subcommands.get(" ".join(part.arguments[:2]))
        if subcommand is None:
            return False
        loaded = subcommand.loaded()
        return is_subcommand_class(loaded) and loaded.allows_pipes
