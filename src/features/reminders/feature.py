from framework.base import Feature
from framework.journal import Journal
from controllers.types import Reminders
from framework.recital import register_recital
from features.reminders.details import RemindersDetails


class RemindersFeature(Feature):
    details = RemindersDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Reminders)
