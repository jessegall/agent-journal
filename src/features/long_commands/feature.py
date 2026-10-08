from features.base import Feature
from features.journal import Journal
from features.long_commands.details import RUN_ENDED, RUN_OPEN, RUN_STALLED, WATCHED, LongCommandsDetails
from features.long_commands.move import MoveLongCommands
from features.long_commands.watch import ended_runs, open_runs, stalled_runs
from features.sending import Nudge


class LongCommands(Feature):
    details = LongCommandsDetails
    nudges = (Nudge(RUN_ENDED, behaviour=WATCHED, about=ended_runs, once=True),
              Nudge(RUN_STALLED, behaviour=WATCHED, about=stalled_runs, once=True),
              Nudge(RUN_OPEN, behaviour=WATCHED, about=open_runs, once=True))

    def register(self, journal: Journal) -> None:
        journal.events.handler(MoveLongCommands())
