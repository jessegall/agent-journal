from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.suggestions.models.enums.suggestion_mark_type import SuggestionMarkType
from core.modules.suggestions.models.enums.suggestion_mark_variant import SuggestionMarkVariant
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionMarkListener(MarkListener):
    """When a suggestion is offered, the chat shows it as a mark the person answers."""

    name = "suggestions.offered-mark"
    event = "suggestion.create"
    module_name = "journal.core.suggestions"

    def handle(self, event: LoggedEvent) -> None:
        suggestion = self.queries.query(Suggestion).find(event.row_id)
        self.show(event, SuggestionMarkType.SUGGESTION, SuggestionMarkVariant.OFFERED, suggestion.title, suggestion.environment_id, row_model="suggestion",
                  row_id=suggestion.id, key=f"suggestion:{suggestion.id}", ended=False)
