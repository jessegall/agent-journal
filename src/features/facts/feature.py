from features.base import Feature
from features.facts.details import FactsDetails
from features.journal import Journal
from features.recital import register_recital


class FactsFeature(Feature):
    details = FactsDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, "facts")
