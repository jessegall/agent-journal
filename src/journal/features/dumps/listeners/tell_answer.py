from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.typed_nudges import TypedNudges
from journal.models.dump import Dump


class TellAnswer(Listener[Updated]):
    """The user's answer to the agent's question on a dump is told to the agent."""

    def __init__(self, typed: TypedNudges) -> None:
        self.typed = typed

    def handle(self, event: Updated) -> None:
        from journal.features.dumps.feature import DumpsFeature
        dump = event.model
        if not isinstance(dump, Dump) or len(dump.answers) <= len(event.was.answers):
            return
        answered = dump.answers[-1]
        self.typed.type(DumpsFeature.THE_USER_ANSWERED_ON_THE_DUMP.create(n=dump.id, answer=answered["answer"], question=answered["question"]))
