from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.needs.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.greater import Greater
from core.modules.processes.agent_messages.output_ended_message import OutputEndedMessage
from core.modules.processes.queries.process_query import ProcessQuery

ENDED_RUNS_REASON = "the agent is told of every run of its that ended since the last answer"


class EndedOutputLineLines(EventLineSource):
    """Tells an agent once, on its next hook that takes lines, that a run it moved to the background has ended; how
    to read such a run better is sent by ReadingNotices when the run ends."""

    key = "processes.ended-output-line"
    events = [event for event in HookEventName if event is not HookEventName.TICK]

    def __init__(self, processes: ProcessQuery, history: LineHistory) -> None:
        self.processes, self.history = processes, history

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if event is None or not event.accepts_lines:
            return []
        spoke_at = self.history.last_spoke(self.key, agent_id)
        ended = self.processes.agent(agent_id).moved().ended()
        if spoke_at is not None:
            ended = ended.matching(Greater("ended_at", spoke_at.text))
        return [OutputEndedMessage.declared().agent_message(output=process.id) for process in ended.every_row(ENDED_RUNS_REASON)]
