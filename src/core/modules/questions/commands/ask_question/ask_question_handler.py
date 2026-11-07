from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.query.queries import Queries
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.questions.support.question_place import QuestionPlace
from core.modules.questions.commands.ask_question.ask_question import AskQuestion
from core.modules.waits.commands.open_wait.open_wait import OpenWait
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.questions.models.question import CONTEXT_LIMIT_CHARACTERS, OPTION_LIMIT_CHARACTERS, TITLE_LIMIT_CHARACTERS, Question


class AskQuestionHandler(Handler[AskQuestion, Question]):
    """Opens the calling agent's question in its environment, the recommended option put first, and the wait
    on it."""

    command = AskQuestion

    def __init__(self, bus: Bus, repository: Repository, queries: Queries) -> None:
        self.bus, self.repository, self.queries = bus, repository, queries

    def handle(self, command: AskQuestion, context: Context) -> Question:
        if not 1 <= len(command.text) <= TITLE_LIMIT_CHARACTERS:
            raise Refusal(f"a question's title is 1 to {TITLE_LIMIT_CHARACTERS} characters, not {len(command.text)}", "say it shorter and put the rest in --context")
        if not command.context.strip():
            raise Refusal("a question needs its context", '--context "<a few sentences: what is being decided, why it came up and what each option means>"')
        if len(command.context) > CONTEXT_LIMIT_CHARACTERS:
            raise Refusal(f"a question's context is up to {CONTEXT_LIMIT_CHARACTERS} characters, not {len(command.context)}", "say it shorter")
        for option in command.options:
            if not 1 <= len(option) <= OPTION_LIMIT_CHARACTERS:
                raise Refusal(f"a question's option is 1 to {OPTION_LIMIT_CHARACTERS} characters, not {len(option)}: {option}", "say it shorter")
        if command.recommended and command.recommended not in command.options:
            raise Refusal(f"the recommended choice is not one of the options: {command.recommended}", "write it word for word as one of --options")
        choices = [command.recommended, *(option for option in command.options if option != command.recommended)] if command.recommended else list(command.options)
        place = self.checked_place(command.place)
        question = self.repository.save(Question(session_agent_id=context.actor.id, creator_id=context.actor.id,
                                             text=command.text, context=command.context.strip(), options=tuple(choices), recommended=command.recommended,
                                             row_model=place.row.model.model_name if place.row is not None else "", row_id=place.row.row_id if place.row is not None else None,
                                             quote=place.quote, position=place.position, selection_type=place.selection_type), context)
        wait = OpenWait(WaitType.ROWS, question.text, [f"questions:{question.id}"])
        self.bus.dispatch(wait, context.nested(wait))
        return question

    def checked_place(self, place: QuestionPlace) -> QuestionPlace:
        if place.position is not None and place.position < 0:
            raise Refusal("a question's position cannot be negative", "name its position in the text, starting at zero")
        if place.row is None:
            if place.quote or place.position is not None:
                raise Refusal("a quoted question needs a document or report", "add --row doc:N or --row report:N")
            return place
        if place.row.model not in (Doc, Report):
            raise Refusal("a question's place must be a document or report", "use --row doc:N or --row report:N")
        row = self.queries.query(place.row.model).find(place.row.row_id)
        if place.quote and place.quote not in row.body:
            raise Refusal("the quote is not in the current text", "read the document or report and quote its current words")
        if place.position is not None and not place.quote:
            raise Refusal("a question's position needs a quote", "add --quote with the selected words")
        if place.quote and place.position is None:
            return replace(place, position=row.body.index(place.quote))
        return place
