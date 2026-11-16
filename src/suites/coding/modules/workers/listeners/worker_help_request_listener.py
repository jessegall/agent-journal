from suites.coding.modules.workers.types.worker import Worker
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from suites.coding.modules.workers.support.merger_inbox import MergerInbox
from suites.coding.modules.workers.agent_messages.worker_help_request_message import WorkerHelpRequestMessage
from suites.coding.modules.workers.support.worker_unfinished_tasks import WorkerUnfinishedTasks
from engine.event.created import Created
from engine.command.context import Context
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

SOURCE = "workers.help-request"


class WorkerHelpRequestListener(SaveListener[Created[Wait]]):
    """A worker that says it is stuck tells the merger at once, or its main agent with the merger off, with
    the reason and the tasks it has left, as a question with its answer time like any other, unless a run of
    its own still goes, which is waiting and not stuck."""

    name = "workers.help-request"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, inbox: MergerInbox, unfinished: WorkerUnfinishedTasks, questions: WorkerQuestions) -> None:
        self.queries, self.inbox, self.unfinished, self.questions = queries, inbox, unfinished, questions

    def handle(self, event: Created[Wait], context: Context) -> None:
        wait = event.row
        if wait.type is not WaitType.HELP_REQUEST:
            return
        worker = self.queries.query(Agent).find(wait.session_agent_id)
        should_notify = worker.role == Worker.key and worker.parent_id is not None and not self.unfinished.has_running_process(worker.id)
        if should_notify:
            tasks = self.unfinished.rows(worker.id)
            agent_message = WorkerHelpRequestMessage.declared().agent_message(worker=worker.id, tasks=self.unfinished.names(tasks), wait=wait.id)
            line = MergerLine(text=agent_message.text, fallback_source=SOURCE, agent_message_json=agent_message.stored.json, topic=AskTopic.GENERAL, worker_id=worker.id)
            self.inbox.deliver(self.questions.timed(line, wait.id, tasks[0].id if tasks else None, context.timestamp), context)
