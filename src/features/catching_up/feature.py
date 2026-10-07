from features.base import Feature
from features.catching_up.commands import Recent
from features.catching_up.details import CatchingUpDetails
from features.catching_up.handlers import HoldUntilCaughtUp
from features.journal import Journal


class CatchingUp(Feature):
    details = CatchingUpDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("message", Recent())
        journal.events.handler(HoldUntilCaughtUp())
