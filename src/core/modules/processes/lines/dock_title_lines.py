from dataclasses import replace

from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY
from core.modules.processes.support.output_title_requests import OutputTitleRequests
from core.modules.processes.agent_messages.run_name_message import RunNameMessage


class DockTitleLines(EventLineSource):
    """Asks for a title for the oldest run whose open request waits for one, as its line's interval allows; the hold
    LongRunDockStates plans holds the agent's tools after five uses until it gives one."""

    key = LONG_RUN_DOCK_KEY
    events = list(HookEventName)

    def __init__(self, requests: OutputTitleRequests) -> None:
        self.requests = requests

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        # the hold is LongRunDockStates', so the line opens no required-command hold of its own
        return [replace(RunNameMessage.declared().agent_message(process=request.process_id), required_command="") for request in self.requests.agent_requests(agent_id)[:1]]
