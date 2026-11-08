from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.base.query.conditions.minimum import Minimum
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.support import worker_job
from suites.coding.modules.workers.support.worker_job import UNFINISHED_TASKS_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_ENDED_WITH_TASKS, WORKER_RESTARTED, WORKER_UNFINISHED_TASKS
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from core.base.command.context import Context
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_program_wait import WorkerProgramWait

SOURCE = "workers.ended-worker"


class EndedWorkerListener(SaveListener[AgentEnded]):
    """A worker that ends with delegated tasks unfinished is told to carry on, which resumes it, so its main
    agent gets one quiet line; one that ended while its tests wait gets its next task from them, and one that
    ended while a run of its own goes is started again when the run ends. A worker that stops while a run of its own goes
    leaves its main agent no line, however often it has stopped, unless a person or another agent stopped it. A worker a
    person or another agent stopped holds no delegated task or was ended by them; that one, one that reported being stuck
    and one that keeps ending with no run going leave its main agent one line naming all its tasks."""

    name = "workers.ended-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, nudger: Nudger, queries: Queries, unfinished: WorkerUnfinishedTasks, stop: WorkerStop, resume: WorkerResume, waits: WorkerProgramWait, inbox: MergerInbox, scopes: Scopes) -> None:
        self.nudger, self.queries, self.unfinished, self.stop = nudger, queries, unfinished, stop
        self.resume, self.waits, self.inbox, self.scopes = resume, waits, inbox, scopes

    def handle(self, event: AgentEnded, context: Context) -> None:
        new = event.row
        if new.role != AgentRole.WORKER or new.parent_id is None:
            return
        unfinished = self.unfinished.rows(new.id)
        if not unfinished:
            return
        is_final = self.stop.is_final(new, context.actor.id)
        if self.unfinished.has_running_process(new.id) and not is_final:
            return
        delegated = any(task.delegated_to == new.id for task in unfinished)
        tasks = self.unfinished.names(unfinished)
        help_requested = self.stop.has_open_help_request(new.id)
        progress = Minimum("created_at", self.unfinished.last_progress_text(new.id))
        resume_count = self.queries.query(AgentLine).filter(session_agent_id=new.id, source=UNFINISHED_TASKS_SOURCE).matching(progress).count()
        should_resume = delegated and not is_final and resume_count < worker_job.RESUME_LIMIT_COUNT
        if should_resume:
            if not help_requested:
                self.nudger.send(new.id, WORKER_UNFINISHED_TASKS, UNFINISHED_TASKS_SOURCE, context)
                state = self.resume.program_state(new)
                if not state.is_ready:
                    self.waits.notify_wait(new, context)
                    return
                self.nudger.send(new.parent_id, WORKER_RESTARTED, SOURCE, context, worker=new.id, tasks=tasks)
                return
        with self.scopes.row_scope(new):
            self.inbox.send_nudge(WORKER_ENDED_WITH_TASKS.nudge(worker=new.id, tasks=tasks), SOURCE, context)
