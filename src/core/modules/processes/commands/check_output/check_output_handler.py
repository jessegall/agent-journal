from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.processes.commands.check_output.check_output import CheckOutput
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.enums.watch_state import WatchState
from core.modules.processes.models.process import Process
from core.modules.processes.models.watch import Watch
from core.modules.processes.support.output_check_schedule import MINUTE_SECONDS, OutputCheckSchedule
from core.modules.processes.support.process_nudges import OUTPUT_CHECK



class CheckOutputHandler(Handler[CheckOutput, Watch]):
    """Wakes an agent that waits on a run still going, naming the run and how long it has waited; a run that ended
    or waits in the queue, a watch that ended and an agent the journal tells when its runs end wake nobody."""

    command = CheckOutput

    def __init__(self, rows: EventRows, repository: Repository, nudger: Nudger, suites: SuiteChoice, schedule: OutputCheckSchedule) -> None:
        self.rows, self.repository, self.nudger, self.suites, self.schedule = rows, repository, nudger, suites, schedule

    def handle(self, command: CheckOutput, context: Context) -> Watch:
        watch = self.rows.required(Watch, command.watch_id)
        process = self.rows.required(Process, watch.process_id)
        agent = self.rows.required(Agent, watch.session_agent_id)
        waiting = watch.state is WatchState.OPEN and process.state in RUNNING_STATES and process.queued_at is None
        if not waiting or agent.role in self.suites.agent_policy().automatic_watch_roles or not self.schedule.wait_elapsed(watch, context.timestamp):
            return watch
        minutes = round(watch.creation_timestamp().elapsed_seconds(context.timestamp) / MINUTE_SECONDS)
        self.nudger.send(agent.id, OUTPUT_CHECK, "processes.output_check", context, output=process.id, minutes=minutes)
        return self.repository.update(watch, context, woke_at=context.timestamp, awaits_confirm=True)
