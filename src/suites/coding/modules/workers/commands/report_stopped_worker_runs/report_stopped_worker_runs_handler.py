from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.report_stopped_worker_runs.report_stopped_worker_runs import SOURCE_KEY_PREFIX, ReportStoppedWorkerRuns
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_RUNS_AFTER_STOP
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_settings import STOPPED_WORKER_RUN_MINUTES
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

STOPPED_RUNS_REASON = "every run still going after its worker stopped is reported once"

RUN_ENDED_REASON = "the run ended or the worker works again"


class ReportStoppedWorkerRunsHandler(Handler[ReportStoppedWorkerRuns, None]):
    """Sends one line for each run of a worker that stopped with tasks left and has waited past the stopped
    worker run minutes while that run still goes, since nothing else would start the worker again. The line
    goes to the merger, or to the main agent while the merger is off, once for each run, and is closed once
    the run ended or the worker works again."""

    command = ReportStoppedWorkerRuns
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, processes: ProcessQuery, unfinished: WorkerUnfinishedTasks, settings: SettingValues, inbox: MergerInbox, questions: WorkerQuestions) -> None:
        self.queries, self.processes, self.unfinished, self.settings, self.inbox, self.questions = queries, processes, unfinished, settings, inbox, questions

    def handle(self, command: ReportStoppedWorkerRuns, context: Context) -> None:
        runs = tuple(self.processes.running().every_row(STOPPED_RUNS_REASON))
        workers = {worker.id: worker for worker in self.queries.query(Agent).find_many(sorted({run.session_agent_id for run in runs}))}
        limit_seconds = self.settings.minutes(STOPPED_WORKER_RUN_MINUTES).count
        reported_runs = {self.source_key(run): run for run in runs if run.session_agent_id in workers and self.is_running_after_stop(workers[run.session_agent_id], context, limit_seconds)}
        lines = {line.source_key: line for line in self.queries.query(MergerLine).matching(Prefix("source_key", SOURCE_KEY_PREFIX)).every_row(STOPPED_RUNS_REASON)}
        for source_key, line in lines.items():
            if source_key not in reported_runs and line.is_open_question():
                self.questions.record(line, AskOutcome.MOOT, RUN_ENDED_REASON, context)
        for source_key, run in reported_runs.items():
            if source_key in lines:
                continue
            nudge = WORKER_RUN_RUNS_AFTER_STOP.nudge(worker=workers[run.session_agent_id].number, output=run.id)
            self.inbox.deliver(MergerLine(text=nudge.text, fallback_source=WORKER_RUN_RUNS_AFTER_STOP.key, nudge_json=nudge.stored.json, worker_id=run.session_agent_id, source_key=source_key), context)

    @staticmethod
    def source_key(run: Process) -> str:
        return f"{SOURCE_KEY_PREFIX}{run.id}"

    def is_running_after_stop(self, worker: Agent, context: Context, limit_seconds: float) -> bool:
        ended_at = worker.ended_at
        if worker.role != CodingHelperRole.WORKER or ended_at is None:
            return False
        return ended_at.elapsed_seconds(context.timestamp) >= limit_seconds and bool(self.unfinished.rows(worker.id))
