from collections.abc import Sequence

from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.part import Part
from engine.enums.hook_event_name import HookEventName
from engine.enums.tool_type import ToolType
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.provider.providers import Providers
from core.modules.processes.nudges.automatic_run_watched_nudge import AutomaticRunWatchedNudge
from core.modules.processes.nudges.monitor_command_note_nudge import MonitorCommandNoteNudge
from core.modules.processes.nudges.monitor_note_nudge import MonitorNoteNudge
from core.modules.processes.support.background_commands import JOURNAL

OUTPUT_STATUS_COMMAND = ["output", "status"]


class OutputStatusMonitorLines(EventLineSource):
    """Explains how a run is monitored, using the suite's declared watch policy."""

    key = "processes.status-monitor"
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, providers: Providers, types: HelperTypeBook, roles: AgentRoleReader) -> None:
        self.providers, self.types, self.roles = providers, types, roles

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        shell = event.tool.shell if event is not None and event.tool is not None else None
        numbers = [part.arguments[2] for part in shell.parts if self.is_status(part)] if shell is not None else []
        if not numbers or event is None:
            return []
        note = self.note(event, agent_id)
        return [note.nudge(output=number) for number in numbers]

    def note(self, event: HookEvent, agent_id: int) -> NudgeDeclaration:
        if self.types.behaviours(self.roles.role(agent_id)).watches_runs_automatically:
            return AutomaticRunWatchedNudge.declared()
        return MonitorCommandNoteNudge.declared() if self.providers.provider(event.program).monitor_tool is ToolType.SHELL else MonitorNoteNudge.declared()

    @staticmethod
    def is_status(part: Part) -> bool:
        return part.program == JOURNAL and list(part.arguments[:2]) == OUTPUT_STATUS_COMMAND and len(part.arguments) > 2
