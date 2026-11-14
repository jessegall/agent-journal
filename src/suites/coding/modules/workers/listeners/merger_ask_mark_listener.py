from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions_handler import JOURNAL_QUESTION_START
from suites.coding.modules.workers.support.main_agent_question import QUESTION_START
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE


class MergerAskMarkListener(MarkListener[Created[Message]]):
    """A question to the main agent about a stuck worker shows in the chat, so a user can see that it was
    asked and who wrote it: the merger, or the journal itself when no merger settled the worker's questions
    in time."""

    name = "workers.merger-ask-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Created[Message], logged: LoggedEvent) -> None:
        message = event.row
        if message.target_agent_id is not None:
            return
        if message.session_agent_id is None:
            self.show_journal_question(message, logged)
            return
        sender = self.event_rows.required(Agent, message.session_agent_id)
        if sender.profile == MERGER_PROFILE:
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.MERGER_QUESTION, "The merger asks the main agent", None, AGENTS_TABLE, sender.id, detail=message.text)

    def show_journal_question(self, message: Message, logged: LoggedEvent) -> None:
        if message.text.startswith(f"{QUESTION_START}{JOURNAL_QUESTION_START}"):
            self.show(logged, WorkerMarkType.WORKER, WorkerMarkVariant.JOURNAL_QUESTION, "The journal passes on a stuck worker", detail=message.text)
