from framework.base import Feature
from features.facts.details import FactsDetails
from framework.journal import Journal
from controllers.types import Facts
from framework.recital import register_recital
from events.facts import FactMentioned, FactsStanding


class FactsFeature(Feature):
    details = FactsDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Facts, FactMentioned, FactsStanding)
