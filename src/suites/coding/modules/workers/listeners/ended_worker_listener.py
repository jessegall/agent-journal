from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_ENDED_WITH_TASKS, WORKER_LAUNCH_FAILED, WORKER_RESTARTED, WORKER_UNFINISHED_TASKS
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.support.worker_launch_failures import WorkerLaunchFailures
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from engine.command.context import Context
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.enums.stop_line_target import StopLineTarget
from suites.coding.modules.workers.models.enums.stop_reading import StopReading
from suites.coding.modules.workers.support.stop_facts_reader import StopFactsReader
from suites.coding.modules.workers.support.worker_program_wait import WorkerProgramWait

SOURCE = "workers.ended-worker"


class EndedWorkerListener(SaveListener[AgentEnded]):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent gets one quiet line; one that ended while its tests wait gets its next task from them, and one that
    ended while a run of its own goes is started again when the run ends. A worker that ended while its
    hand-in is under way leaves its main agent no line, and a program that ended within seconds of its start
    is reported to the main agent as a launch failure, with the error it wrote. A worker that stops while a
    run of its own goes leaves its main agent no line, however often it has stopped, unless a person or
    another agent stopped it. A worker a person or another agent stopped holds no delegated task or was ended
    by them and one that reported being stuck leave one line naming all its tasks through the merger; one that
    keeps ending with no run going leaves its main agent that line itself, since nobody else can start it."""

    name = "workers.ended-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, resume: WorkerResume, waits: WorkerProgramWait, inbox: MergerInbox, scopes: Scopes, handoff: WorkerHandoff, launches: WorkerLaunchFailures, guidance: WorkerGuidance, main_line: MainAgentLine, stop_facts: StopFactsReader) -> None:
        self.guidance, self.main_line, self.stop_facts = guidance, main_line, stop_facts
        self.nudger, self.queries, self.unfinished, self.stop = nudger, queries, unfinished, stop
        self.resume, self.waits, self.inbox, self.scopes = resume, waits, inbox, scopes
        self.handoff, self.launches = handoff, launches

    def handle(self, event: AgentEnded, context: Context) -> None:
        new = event.row
        if new.role != CodingHelperRole.WORKER or new.parent_id is None:
            return
        facts = self.stop_facts.read(new, context.actor.id)
        if facts is None:
            return
        stop_case = facts.reading()
        worker_round = self.unfinished.steps.round(new.id)
        if stop_case.resumes_worker:
            self.nudger.send(new.id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, context, line=self.guidance.round_point(worker_round).line)
        if stop_case is StopReading.RESUMED_PROGRAM_STARTING:
            self.waits.notify_wait(new, context)
        if stop_case.line_target is None:
            return
        with self.scopes.row_scope(new):
            self.send_line(new, stop_case, facts.task_names, context)

    def send_line(self, worker: Agent, stop_case: StopReading, tasks: str, context: Context) -> None:
        if stop_case is StopReading.LAUNCH_FAILURE:
            self.nudger.send(worker.parent_id, WORKER_LAUNCH_FAILED, SOURCE, context, worker=worker.number, line=self.launches.error_text(worker))
            return
        declaration = WORKER_RESTARTED if stop_case.resumes_worker else WORKER_ENDED_WITH_TASKS
        line = declaration.nudge(worker=worker.number, tasks=tasks)
        if stop_case.line_target is StopLineTarget.MAIN_AGENT:
            self.main_line.send_nudge(line, SOURCE, context)
            return
        self.inbox.send_nudge(line, SOURCE, context)
