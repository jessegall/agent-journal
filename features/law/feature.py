from features.base import Feature
from features.journal import Journal
from features.law.details import LawDetails
from features.law.interceptors import EnforceDispatchLaw


class Law(Feature):
    details = LawDetails

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(EnforceDispatchLaw())
