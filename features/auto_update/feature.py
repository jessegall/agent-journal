from features.base import Feature
from features.journal import Journal
from features.auto_update.details import UpdatesDetails
from features.auto_update.handlers import InstallNewerVersion


class Updates(Feature):
    details = UpdatesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(InstallNewerVersion())
