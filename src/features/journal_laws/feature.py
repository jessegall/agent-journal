from features.base import Feature
from features.journal import Journal
from features.journal_laws.details import LawDetails
from features.journal_laws.handlers import NoticeLargestResult
from features.journal_laws.interceptors import EnforceDispatchLaw, WhisperLawInChat, WhisperLawOnKeyword


class Law(Feature):
    details = LawDetails

    def register(self, journal: Journal) -> None:
        journal.agent.canceler(EnforceDispatchLaw())
        journal.agent.interceptor(WhisperLawOnKeyword())
        journal.events.handler(WhisperLawInChat())
        journal.events.handler(NoticeLargestResult())
