from features.base import Feature
from features.journal import Journal
from features.recital import RepeatStanding, WhisperOnKeyword, WhisperOnKeywordInChat
from features.rules.details import RulesDetails
from features.rules.handlers import InjectRules


class RulesFeature(Feature):
    details = RulesDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(WhisperOnKeyword("rules"))
        journal.events.handler(WhisperOnKeywordInChat("rules"))
        journal.events.handler(RepeatStanding("rules"))
        journal.events.handler(InjectRules())
