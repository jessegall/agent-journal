from dataclasses import replace

from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.questions.commands.answer_question.answer_question import AnswerQuestion
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question


class AnswerQuestionHandler(Handler[AnswerQuestion, Question]):
    """Keeps a genuine person answer and the question move in one transaction."""

    command = AnswerQuestion

    def __init__(self, rows: EventRows, repository: Repository, bus: Bus, scopes: Scopes, messages: MessageQuery) -> None:
        self.rows, self.repository, self.bus, self.scopes, self.messages = rows, repository, bus, scopes, messages

    def handle(self, command: AnswerQuestion, context: Context) -> Question:
        question = self.rows.required(Question, command.row_id)
        if question.state is QuestionState.OPEN and context.actor.type is ActorType.USER:
            command = self.with_person_message(command, question, context)
        return self.repository.save_change(question, question.moved(command.move, **command.move_fields()), context)

    def with_person_message(self, command: AnswerQuestion, question: Question, context: Context) -> AnswerQuestion:
        with self.scopes.row_scope(question):
            if command.message_id is not None:
                message = self.messages.addressed(question.session_agent_id).filter(id=command.message_id).first()
                if message is None or message.type not in PERSON_MESSAGE_TYPES or message.creator_id != context.actor.id:
                    raise Refusal("use a person answer from its author addressed to the agent that asked this question")
                return command
            message = self.bus.dispatch(SendMessage(command.answer, target_agent_id=question.session_agent_id),
                                        replace(context, environment_id=question.environment_id))
            return replace(command, message_id=message.id)
