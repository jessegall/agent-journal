
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.request.request_values import RequestValues
from core.modules.processes.commands.record_given_percent.record_given_percent import RecordGivenPercent
from core.modules.processes.models.watch import UNANNOUNCED_PERCENT, Watch
from core.modules.processes.agent_messages.output_progress_message import OutputProgressMessage
from core.modules.processes.agent_messages.active_output_message import ActiveOutputMessage
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.queries.watch_query import WatchQuery

from core.modules.processes.support.watched_progress import WatchedProgress
PROGRESS_STEP_PERCENT = 10


class WatchProgress:
    """After every tool use, an agent watching a run is told once that it runs, then its progress only as it
    passes each 10 percent; the run's end has its own line, and its output is read on request. Read once a
    hook, so the lines and the percent they record agree."""

    def __init__(self, watches: WatchQuery, processes: ProcessQuery, request_values: RequestValues) -> None:
        self.watches, self.processes, self.request_values = watches, processes, request_values

    def progress(self, event: HookEvent, agent_id: int) -> WatchedProgress:
        # read once a hook whatever changes meanwhile: the percent it records is what the next read compares with
        return self.request_values.read(f"processes.watch-progress:{agent_id}:{event.event_id}", lambda: event.event_id, lambda: self.found(agent_id))

    def found(self, agent_id: int) -> WatchedProgress:
        given = [line for watch in tuple(self.watches.progress_due(agent_id, PROGRESS_STEP_PERCENT).oldest().get()) if (line := self.given(watch)) is not None]
        return WatchedProgress(tuple(agent_message for agent_message, _ in given), tuple(command for _, command in given))

    def given(self, watch: Watch) -> tuple[AgentMessage, Command[object]] | None:
        if watch.given_percent == UNANNOUNCED_PERCENT:
            return ActiveOutputMessage.declared().agent_message(output=watch.process_id), RecordGivenPercent(watch.id, 0)
        progress = self.processes.find(watch.process_id).progress
        step = progress - progress % PROGRESS_STEP_PERCENT
        if step <= watch.given_percent:
            return None
        return OutputProgressMessage.declared().agent_message(output=watch.process_id, percent=progress), RecordGivenPercent(watch.id, step)
