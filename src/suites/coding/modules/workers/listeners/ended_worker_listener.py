from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.main_agent_line import MainAgentLine
from engine.driver.nudger import Nudger
from engine.query.conditions.minimum import Minimum
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support import worker_job
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_ENDED_WITH_TASKS, WORKER_LAUNCH_FAILED, WORKER_RESTARTED, WORKER_UNFINISHED_TASKS
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_handoff import WorkerHandoff
from suites.coding.modules.workers.support.worker_launch_failures import WorkerLaunchFailures
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from engine.command.context import Context
from suites.coding.modules.workers.support.worker_resume import WorkerResume
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

    def __init__(self, nudger: Nudger, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, resume: WorkerResume, waits: WorkerProgramWait, inbox: MergerInbox, scopes: Scopes, handoff: WorkerHandoff, launches: WorkerLaunchFailures, guidance: WorkerGuidance, main_line: MainAgentLine) -> None:
        self.guidance, self.main_line = guidance, main_line
        self.nudger, self.queries, self.unfinished, self.stop = nudger, queries, unfinished, stop
        self.resume, self.waits, self.inbox, self.scopes = resume, waits, inbox, scopes
        self.handoff, self.launches = handoff, launches

    def handle(self, event: AgentEnded, context: Context) -> None:
        new = event.row
        if new.role != CodingHelperRole.WORKER or new.parent_id is None or self.resume.compaction.is_running(new.id):
            return
        worker_round = self.unfinished.steps.round(new.id)
        unfinished = self.unfinished.round_rows(worker_round)
        if not unfinished:
            return
        is_final = self.stop.is_final(new, context.actor.id)
        if (self.unfinished.has_running_process(new.id) or self.handoff.is_pending(new)) and not is_final:
            return
        if self.launches.has_failed(new) and not is_final:
            self.nudger.send(new.parent_id, WORKER_LAUNCH_FAILED, SOURCE, context, worker=new.id, line=self.launches.error_text(new))
            return
        delegated = any(task.delegated_to == new.id for task in unfinished)
        tasks = self.unfinished.names(unfinished)
        help_requested = worker_round.is_asking
        progress = Minimum("created_at", self.unfinished.last_progress_text(new.id))
        resume_count = self.queries.query(AgentLine).filter(session_agent_id=new.id, source=UNFINISHED_TASKS_SOURCE).matching(progress).count()
        should_resume = delegated and not is_final and resume_count < worker_job.RESUME_LIMIT_COUNT
        if should_resume:
            if not help_requested:
                self.nudger.send(new.id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, context, line=self.guidance.round_point(worker_round).line)
                state = self.resume.program_state(new)
                if not state.is_ready:
                    self.waits.notify_wait(new, context)
                    return
                self.nudger.send(new.parent_id, WORKER_RESTARTED, SOURCE, context, worker=new.id, tasks=tasks)
                return
        resume_limit_reached = delegated and not is_final and not help_requested
        with self.scopes.row_scope(new):
            (self.main_line if resume_limit_reached else self.inbox).send_nudge(WORKER_ENDED_WITH_TASKS.nudge(worker=new.id, tasks=tasks), SOURCE, context)
