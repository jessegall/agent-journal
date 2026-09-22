from features.base import Feature
from features.facts.details import FactsDetails
from features.journal import Journal
from features.recital import RepeatStanding, WhisperOnKeyword, WhisperOnKeywordInChat


class FactsFeature(Feature):
    details = FactsDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(WhisperOnKeyword("facts"))
        journal.events.handler(WhisperOnKeywordInChat("facts"))
        journal.events.handler(RepeatStanding("facts"))
