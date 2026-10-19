from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.dumps.filing import OWN_WORDS
from journal.features.dumps.telling import Telling
from journal.models.dump import Dump


class TellChoice(Listener[Updated]):
    """The user's pick of a next step, or leaving it to the agent, is told to the agent; their own words reach it as a message."""

    def __init__(self, telling: Telling) -> None:
        self.telling = telling

    def handle(self, event: Updated) -> None:
        from journal.features.dumps.feature import DumpsFeature
        dump = event.model
        if not isinstance(dump, Dump) or not dump.chosen or dump.chosen == event.was.chosen or dump.chosen["pick"] == OWN_WORDS:
            return
        if dump.chosen["pick"] < 0:
            self.telling.tell(DumpsFeature.DECIDE.about(n=dump.id))
        else:
            self.telling.tell(DumpsFeature.CHOSE.about(n=dump.id, label=dump.chosen["label"]))
