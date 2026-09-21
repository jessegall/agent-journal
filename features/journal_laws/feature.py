from features.base import Feature
from features.journal import Journal
from features.journal_laws.details import LawDetails
from features.journal_laws.interceptors import EnforceDispatchLaw


class Law(Feature):
    details = LawDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(EnforceDispatchLaw())
