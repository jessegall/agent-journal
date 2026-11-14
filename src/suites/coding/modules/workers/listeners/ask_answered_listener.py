from engine.command.context import Context
from engine.event.created import Created
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_recipient import WorkerRecipient

ANSWER_TEXT = "the main agent sent you its answer"


class AskAnsweredListener(SaveListener[Created[Message]]):
    """A message to a worker from someone else answers the questions of that worker that went to the main agent, which end as answered."""

    name = "workers.ask-answered"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions) -> None:
        self.questions = questions

    def handle(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type is not MessageType.PEER or not WorkerRecipient.matches_worker(message.recipient):
            return
        worker_id = WorkerRecipient.worker_id(message.recipient)
        if message.creator_id != worker_id:
            self.questions.settle_forwarded(worker_id, AskOutcome.ANSWERED, ANSWER_TEXT, context)
