from features.base import Feature
from features.journal import Journal
from features.suggestions.details import SuggestionsDetails
from features.suggestions.handlers import FileDecidedSuggestion


class SuggestionsDecided(Feature):
    details = SuggestionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(FileDecidedSuggestion())
