from suites.coding.modules.workers.types.worker import Worker
from engine.command.context import Context
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.assignments.support.assignments import Assignments
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.phase import Phase
from engine.query.queries import Queries
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.retired_worker_tasks_message import RetiredWorkerTasksMessage
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

SOURCE = "workers.retired-worker"


class RetiredWorkerListener(SaveListener[Updated[Agent]]):
    """A worker a user retires while it has tasks left leaves the merger one line that names all of them, its
    open questions are closed as moot: nobody is left to answer, and the plans and phases given to it are no
    longer its, so no plan shows a retired worker and no new task of a plan goes to one."""

    name = "workers.retired-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions, unfinished: WorkerUnfinishedTasks, inbox: MergerInbox, scopes: Scopes, assignments: Assignments, queries: Queries) -> None:
        self.questions, self.unfinished, self.inbox, self.scopes = questions, unfinished, inbox, scopes
        self.assignments, self.queries = assignments, queries

    def handle(self, event: Updated[Agent], context: Context) -> None:
        worker = event.row
        if worker.role != Worker.key or not worker.is_newly_retired(event.previous):
            return
        self.questions.close_worker_lines(worker.id, "the worker was retired", context)
        self.leave_plans(worker, context)
        tasks = self.unfinished.rows(worker.id)
        if tasks:
            with self.scopes.row_scope(worker):
                self.inbox.send_agent_message(self.unfinished.message(RetiredWorkerTasksMessage, worker, tasks), SOURCE, context)

    def leave_plans(self, worker: Agent, context: Context) -> None:
        for model in (Plan, Phase):
            for held in self.queries.query(model).find_many(self.assignments.held_row_ids(model, worker.id)):
                self.assignments.unassign(held, context, worker.id)
