from features.base import Feature
from features.journal import Journal
from features.nudges.details import NudgesDetails
from features.nudges.standing import AskAgain, ClearWhenAnswered, StandUntilAnswered


class NudgesFeature(Feature):
    details = NudgesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(StandUntilAnswered())
        journal.events.handler(ClearWhenAnswered())
        journal.events.handler(AskAgain())
