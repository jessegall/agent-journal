from suites.coding.modules.workers.types.worker import Worker
from engine.command.context import Context
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.retired_worker_tasks_message import RetiredWorkerTasksMessage
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks

SOURCE = "workers.retired-worker"


class RetiredWorkerListener(SaveListener[Updated[Agent]]):
    """A worker a user retires while it has tasks left leaves the merger one line that names all of them, and
    its open questions are closed as moot: nobody is left to answer."""

    name = "workers.retired-worker"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions, unfinished: WorkerUnfinishedTasks, inbox: MergerInbox, scopes: Scopes) -> None:
        self.questions, self.unfinished, self.inbox, self.scopes = questions, unfinished, inbox, scopes

    def handle(self, event: Updated[Agent], context: Context) -> None:
        worker = event.row
        if worker.role != Worker.key or not worker.is_newly_retired(event.previous):
            return
        self.questions.close_worker_lines(worker.id, "the worker was retired", context)
        tasks = self.unfinished.rows(worker.id)
        if tasks:
            with self.scopes.row_scope(worker):
                self.inbox.send_agent_message(RetiredWorkerTasksMessage.declared().agent_message(worker=worker.number, tasks=self.unfinished.names(tasks)), SOURCE, context)
