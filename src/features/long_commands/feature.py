from features.base import Feature
from features.journal import Journal
from features.long_commands.details import LongCommandsDetails
from features.long_commands.handlers import MoveLongCommands


class LongCommands(Feature):
    details = LongCommandsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(MoveLongCommands())
