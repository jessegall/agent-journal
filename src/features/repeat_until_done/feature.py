from features.base import Feature
from features.journal import Journal
from features.repeat_until_done.details import RepeatUntilDoneDetails
from features.repeat_until_done.handlers import AskAgain, ClearWhenAnswered, StandUntilAnswered


class RepeatUntilDone(Feature):
    details = RepeatUntilDoneDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(StandUntilAnswered())
        journal.events.handler(ClearWhenAnswered())
        journal.events.handler(AskAgain())
