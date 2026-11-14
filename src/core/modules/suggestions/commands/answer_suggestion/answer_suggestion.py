from dataclasses import dataclass

from engine.command.command import Command
from core.modules.suggestions.models.enums.suggestion_answer import SuggestionAnswer
from core.modules.suggestions.models.suggestion import Suggestion


@dataclass(frozen=True)
class AnswerSuggestion(Command[Suggestion]):
    """The user accepts or declines a suggestion, once."""

    suggestion_id: int
    answer: SuggestionAnswer
