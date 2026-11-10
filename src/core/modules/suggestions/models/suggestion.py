from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from core.modules.suggestions.models.enums.suggestion_answer import SuggestionAnswer


@dataclass(frozen=True, kw_only=True)
class Suggestion(EnvironmentScoped, Model):
    """Something the journal offers the person once, by its key, in the environment it was offered in, with
    their answer once they give one."""

    model_name = "suggestion"
    cli_name = "suggestion"
    search_fields = ["title"]

    environment_id: int = 0
    creator_id: int
    key: str
    title: str
    answer: SuggestionAnswer | None = None
