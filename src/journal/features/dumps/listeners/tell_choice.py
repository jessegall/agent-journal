from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.dumps.support.filing import OWN_WORDS
from journal.support.typed_nudges import TypedNudges
from journal.models.dump import Dump


class TellChoice(Listener[Updated]):
    """The user's pick of a next step, or leaving it to the agent, is told to the agent; their own words reach it as a message."""

    def __init__(self, typed: TypedNudges) -> None:
        self.typed = typed

    def handle(self, event: Updated) -> None:
        from journal.features.dumps.feature import DumpsFeature
        dump = event.model
        if not isinstance(dump, Dump) or not dump.chosen or dump.chosen == event.was.chosen or dump.chosen["pick"] == OWN_WORDS:
            return
        if dump.chosen["pick"] < 0:
            self.typed.type(DumpsFeature.DUMP_LEFT_TO_YOU_FINISH_IT.create(n=dump.id))
        else:
            self.typed.type(DumpsFeature.THE_USER_CHOSE_A_STEP.create(n=dump.id, label=dump.chosen["label"]))
