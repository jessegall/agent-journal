from features.base import Feature
from features.journal import Journal
from features.updates.details import UpdatesDetails
from features.updates.handlers import InstallNewerVersion


class Updates(Feature):
    details = UpdatesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(InstallNewerVersion())
