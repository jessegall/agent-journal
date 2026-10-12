from features.attachment_descriptions.details import AttachmentDescriptionsDetails
from events.agents import SessionStarted
from events.messages import MessageUpdated
from expects import Given, Nudged, Unchanged, Updated, answering
from features.attachment_descriptions.video import TAGGED
from features.attachment_descriptions.handlers import SampleVideoFrames, TagMissingAtStart, TagNewMedia
from events.resources import FileAttached
from features.base import Feature
from features.journal import Journal
from resources.base import USER
from resources.types import AgentRow, Message

LIVE = AgentRow(n=1, title="claude-1", data={"status": "idle"})


def attached(name: str) -> FileAttached:
    return FileAttached(n=5, type="message", action="updated", actor=USER, file=name)


def recorded(name: str) -> MessageUpdated:
    return MessageUpdated(n=5, type="message", action="updated", actor=USER, numbers=(5,), file=name)


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
        journal.events.handler(SampleVideoFrames(), expects=[
            Given(recorded("clip.mp4"), rows=[with_files(**{"clip.mp4": ""})], processes=answering({"git": "/usr/bin/git"}))
                >> Updated(Message(n=5), files={"clip.mp4": f"{TAGGED}ffmpeg and ffprobe are required to extract frames"}),
            Given(recorded("photo.png"), rows=[with_files(**{"photo.png": ""})], processes=answering({"git": "/usr/bin/git"})) >> Unchanged(),
            Given(recorded(""), rows=[with_files(**{"clip.mp4": ""})], processes=answering({"git": "/usr/bin/git"})) >> Unchanged(),
        ])
