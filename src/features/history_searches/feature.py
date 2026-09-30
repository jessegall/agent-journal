from features.base import Feature
from features.history_searches.details import HistorySearchesDetails
from features.history_searches.handlers import MarkHistorySearches
from features.journal import Journal


class HistorySearches(Feature):
    details = HistorySearchesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(MarkHistorySearches())
