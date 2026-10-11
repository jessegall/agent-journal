import features.dumps.controller  # noqa: F401
from engine.events.resources import MessageUpdated
from expects import Given, Unchanged, Updated, Wrote
from features.base import Feature
from features.dumps.resource import Dump
from features.dumps.details import DumpsDetails
from features.dumps.handlers import CarryOnFiling, PromptFiling, TranscriptToDump
from features.journal import Journal
from resources.base import USER
from resources.types import Message

TOUCHED = MessageUpdated(n=5, type="message", action="updated", actor=USER, numbers=(5,))


class DumpsFeature(Feature):
    details = DumpsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PromptFiling())
        journal.events.handler(CarryOnFiling())
        journal.events.handler(TranscriptToDump(), expects=[
            Given(TOUCHED, rows=[Message(n=5, title="A pasted conversation", brief="User: hello\nAgent: hi", data={"kind": "transcript"})])
                >> Wrote(Dump(brief="User: hello\nAgent: hi")) & Updated(Message(n=5), refs=["dump:1"]),
            Given(TOUCHED, rows=[Message(n=5, title="A question", brief="Can you look?")]) >> Unchanged(),
            Given(TOUCHED, rows=[Message(n=5, title="A pasted conversation", brief="User: hello", refs=["dump:3"], data={"kind": "transcript"})]) >> Unchanged(),
        ])
