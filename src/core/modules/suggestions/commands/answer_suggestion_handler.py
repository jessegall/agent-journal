from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.suggestions.commands.answer_suggestion import AnswerSuggestion
from core.modules.suggestions.models.suggestion import Suggestion


class AnswerSuggestionHandler(Handler[AnswerSuggestion, Suggestion]):
    """Keeps the person's answer to a suggestion; a second answer is refused."""

    command = AnswerSuggestion

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AnswerSuggestion, context: Context) -> Suggestion:
        suggestion = self.queries.query(Suggestion).find(command.suggestion_id)
        if suggestion.answer is not None:
            raise Refusal(f"suggestion {suggestion.id} was answered already: {suggestion.answer}", "the person answers a suggestion once")
        return self.repository.save(suggestion.changed(answer=command.answer), context)
