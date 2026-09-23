from features.base import Feature
from features.journal import Journal
from features.recital import register_recital
from features.reminders.details import RemindersDetails


class RemindersFeature(Feature):
    details = RemindersDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, "reminders")
