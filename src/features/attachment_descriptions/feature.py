from features.attachment_descriptions.details import AttachmentDescriptionsDetails
from engine.events.agents import SessionStarted
from expects import Given, Nudged, Unchanged
from features.attachment_descriptions.handlers import FileAttached, SampleVideoFrames, TagMissingAtStart, TagNewMedia
from features.base import Feature
from features.journal import Journal
from resources.base import USER
from resources.types import AgentRow, Message

LIVE = AgentRow(n=1, title="claude-1", data={"status": "idle"})


def attached(name: str) -> FileAttached:
    return FileAttached(n=5, type="message", action="updated", actor=USER, file=name)


def with_files(**files) -> Message:
    return Message(n=5, title="Look at this", data={"files": files})


class AttachmentDescriptions(Feature):
    details = AttachmentDescriptionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(TagNewMedia(), expects=[
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Nudged("untagged"),
            Given(attached("notes.txt"), rows=[with_files(**{"notes.txt": ""}), LIVE]) >> Unchanged(),
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": "a screenshot of the login page"}), LIVE]) >> Unchanged(),
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": ""})]) >> Unchanged(),
        ])
        journal.events.handler(TagMissingAtStart(), expects=[
            Given(SessionStarted(agent=1), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Nudged("untagged"),
            Given(SessionStarted(agent=1), rows=[with_files(**{"a.png": "", "b.png": "", "c.png": "", "d.png": ""}), LIVE]) >> Nudged("many untagged"),
            Given(SessionStarted(agent=1), rows=[with_files(**{"photo.png": "a screenshot of the login page"}), LIVE]) >> Unchanged(),
            Given(SessionStarted(agent=1), rows=[with_files(**{"notes.txt": ""}), LIVE]) >> Unchanged(),
            Given(SessionStarted(agent=1), rows=[LIVE]) >> Unchanged(),
        ])
        journal.events.handler(SampleVideoFrames())
