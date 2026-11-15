from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.processes.nudges.monitor_command_note_nudge import MonitorCommandNoteNudge
from core.modules.processes.nudges.monitor_note_nudge import MonitorNoteNudge
from core.modules.processes.nudges.automatic_run_watched_nudge import AutomaticRunWatchedNudge
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.hook_event_name import HookEventName
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from engine.enums.tool_type import ToolType
from engine.provider.providers import Providers
from core.modules.processes.support.background_commands import JOURNAL

OUTPUT_STATUS_COMMAND = ["output", "status"]


class OutputStatusMonitorRule(DriverRule):
    """Explains how a run is monitored, using the suite's declared watch policy."""

    name = "processes.status-monitor"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, providers: Providers, types: HelperTypeBook) -> None:
        self.providers, self.types = providers, types

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        numbers = [part.arguments[2] for part in shell.parts if self.is_status(part)] if shell is not None else []
        note = self.note(hook)
        return RuleAnswer.with_nudges(*(note.nudge(output=number) for number in numbers))

    def note(self, hook: AgentHook) -> NudgeDeclaration:
        if self.types.behaviours(hook.role).watches_runs_automatically:
            return AutomaticRunWatchedNudge.declared()
        return MonitorCommandNoteNudge.declared() if self.providers.provider(hook.event.program).monitor_tool is ToolType.SHELL else MonitorNoteNudge.declared()

    def is_status(self, part: Part) -> bool:
        return part.program == JOURNAL and list(part.arguments[:2]) == OUTPUT_STATUS_COMMAND and len(part.arguments) > 2
