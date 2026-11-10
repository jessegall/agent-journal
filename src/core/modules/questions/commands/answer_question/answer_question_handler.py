from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.queries.message_query import MessageQuery
from core.modules.questions.commands.answer_question.answer_question import AnswerQuestion
from core.modules.questions.models.enums.question_state import QuestionState
from core.modules.questions.models.question import Question


class AnswerQuestionHandler(Handler[AnswerQuestion, Question]):
    """Moves a question to answered. A person's answer is no message of theirs: the chat shows it as one
    answered mark of the question, and the agent hears of it once, through the answered question. A message
    the person already wrote may be named as the answer's source, if it is theirs and addressed to the
    agent that asked."""

    command = AnswerQuestion

    def __init__(self, rows: EventRows, repository: Repository, scopes: Scopes, messages: MessageQuery) -> None:
        self.rows, self.repository, self.scopes, self.messages = rows, repository, scopes, messages

    def handle(self, command: AnswerQuestion, context: Context) -> Question:
        question = self.rows.required(Question, command.row_id)
        is_person_answer = question.state is QuestionState.OPEN and context.actor.type is ActorType.USER and command.message_id is not None
        if is_person_answer:
            self.check_source(command, question, context)
        return self.repository.save_change(question, question.moved(command.move, **command.move_fields()), context)

    def check_source(self, command: AnswerQuestion, question: Question, context: Context) -> None:
        with self.scopes.row_scope(question):
            message = self.messages.addressed(question.session_agent_id).filter(id=command.message_id).first()
            if message is None or message.type not in PERSON_MESSAGE_TYPES or message.creator_id != context.actor.id:
                raise Refusal("use a person answer from its author addressed to the agent that asked this question")
