from engine.helper_type.helper_type_book import HelperTypeBook
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from engine.driver.message_sender import MessageSender
from core.modules.processes.commands.check_output.check_output import CheckOutput
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import Watch
from core.modules.processes.support.output_check_schedule import MINUTE_SECONDS, OutputCheckSchedule
from core.modules.processes.agent_messages.output_check_message import OutputCheckMessage



class CheckOutputHandler(Handler[CheckOutput, Watch]):
    """Wakes an agent that waits on a run still going, naming the run and how long it has waited; a run that ended
    or waits in the queue, a watch that ended and an agent the journal tells when its runs end wake nobody."""

    command = CheckOutput

    def __init__(self, rows: EventRows, repository: Repository, message_sender: MessageSender, types: HelperTypeBook, schedule: OutputCheckSchedule) -> None:
        self.rows, self.repository, self.message_sender, self.types, self.schedule = rows, repository, message_sender, types, schedule

    def handle(self, command: CheckOutput, context: Context) -> Watch:
        watch = self.rows.required(Watch, command.watch_id)
        process = self.rows.required(Process, watch.process_id)
        agent = self.rows.required(Agent, watch.session_agent_id)
        waiting = watch.state is WatchState.OPEN and process.state in RUNNING_STATES and process.queued_at is None
        if not waiting or self.types.behaviours(agent.role).watches_runs_automatically or not self.schedule.wait_elapsed(watch, context.timestamp):
            return watch
        minutes = round(watch.creation_timestamp().elapsed_seconds(context.timestamp) / MINUTE_SECONDS)
        self.message_sender.send(agent.id, OutputCheckMessage.declared(), "processes.output_check", context, output=process.id, minutes=minutes)
        return self.repository.update(watch, context, notified_at=context.timestamp, awaits_confirm=True)
