from features.base import Feature
from features.suggestions.controller import waiting_suggestions
from overview.parts import SUMMARY_COUNTS
from features.journal import Journal
from features.suggestions.details import SuggestionsDetails
from features.suggestions.handlers import FileDecidedSuggestion


class SuggestionsFeature(Feature):
    details = SuggestionsDetails

    def register(self, journal: Journal) -> None:
        SUMMARY_COUNTS.add(None, waiting_suggestions, key="suggestions")
        journal.events.handler(FileDecidedSuggestion())
