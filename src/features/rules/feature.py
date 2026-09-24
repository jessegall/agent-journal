from features.base import Feature
from features.journal import Journal
from features.recital import register_recital
from features.rules.details import RulesDetails
from features.rules.handlers import InjectRules, ReviewNewRule


class RulesFeature(Feature):
    details = RulesDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, "rules")
        journal.events.handler(InjectRules())
        journal.events.handler(ReviewNewRule())
