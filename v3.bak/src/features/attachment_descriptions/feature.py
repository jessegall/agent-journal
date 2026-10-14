from features.attachment_descriptions.details import AttachmentDescriptionsDetails
from events.agents import SessionStarted
from events.attachment_descriptions import ManyMediaUntagged, MediaAttached, MediaUntagged, VideoToSample
from events.messages import MessageUpdated
from expects import Dispatches, Given, Nudged, Unchanged, Updated, answering, nothing
from features.attachment_descriptions.video import TAGGED
from features.attachment_descriptions.handlers import SampleVideoFrames, TellLiveAgents, TellManyUntagged, TellUntagged
from features.attachment_descriptions.listeners import SpotMissingMedia, SpotNewMedia, SpotVideo
from events.resources import FileAttached
from framework.base import Feature
from framework.journal import Journal
from resources.base import AGENT, USER
from resources.types import AgentRow, Message

LIVE = AgentRow(n=1, title="claude-1", data={"status": "idle"})


def attached(name: str) -> FileAttached:
    return FileAttached(n=5, type="message", action="updated", actor=USER, file=name)


def recorded(name: str) -> MessageUpdated:
    return MessageUpdated(n=5, type="message", action="updated", actor=USER, numbers=(5,), file=name)


def with_files(**files) -> Message:
    """A message the agent has already read: an unread one is not asked about, since the line announcing it already names the file it brings."""
    return Message(n=5, title="Look at this", seen=[AGENT], data={"files": files})


class AttachmentDescriptions(Feature):
    details = AttachmentDescriptionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(FileAttached, SpotNewMedia(), expects=[
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Dispatches(MediaAttached(type="message", n=5, name="photo.png")),
            Given(attached("photo.png"), rows=[Message(n=5, title="Look at this", data={"files": {"photo.png": ""}}), LIVE]) >> Dispatches(nothing),
            Given(attached("notes.txt"), rows=[with_files(**{"notes.txt": ""}), LIVE]) >> Dispatches(nothing),
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": "a screenshot of the login page"}), LIVE]) >> Dispatches(nothing),
            Given(attached("photo.png"), rows=[with_files(**{"photo.png": ""})]) >> Dispatches(MediaAttached(type="message", n=5, name="photo.png")),
        ])
        journal.events.handle(MediaAttached, TellLiveAgents(), expects=[
            Given(MediaAttached(type="message", n=5, name="photo.png"), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Nudged("untagged"),
            Given(MediaAttached(type="message", n=5, name="photo.png"), rows=[with_files(**{"photo.png": ""})]) >> Unchanged(),
        ])
        journal.events.listen(SessionStarted, SpotMissingMedia(), expects=[
            Given(SessionStarted(agent=1), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Dispatches(MediaUntagged(type="message", n=5, name="photo.png")),
            Given(SessionStarted(agent=1), rows=[with_files(**{"a.png": "", "b.png": "", "c.png": "", "d.png": ""}), LIVE])
                >> Dispatches(ManyMediaUntagged(count=4, listed='message 5 "a.png"; message 5 "b.png"; message 5 "c.png"; message 5 "d.png"')),
            Given(SessionStarted(agent=1), rows=[with_files(**{"photo.png": "a screenshot of the login page"}), LIVE]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[with_files(**{"notes.txt": ""}), LIVE]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[LIVE]) >> Dispatches(nothing),
        ])
        journal.events.handle(MediaUntagged, TellUntagged(), expects=[
            Given(MediaUntagged(type="message", n=5, name="photo.png"), rows=[with_files(**{"photo.png": ""}), LIVE]) >> Nudged("untagged"),
        ])
        journal.events.handle(ManyMediaUntagged, TellManyUntagged(), expects=[
            Given(ManyMediaUntagged(count=4, listed='message 5 "a.png"'), rows=[LIVE]) >> Nudged("many untagged"),
        ])
        journal.events.listen(MessageUpdated, SpotVideo(), expects=[
            Given(recorded("clip.mp4"), rows=[with_files(**{"clip.mp4": ""})]) >> Dispatches(VideoToSample(message=5, name="clip.mp4")),
            Given(recorded("photo.png"), rows=[with_files(**{"photo.png": ""})]) >> Dispatches(nothing),
            Given(recorded(""), rows=[with_files(**{"clip.mp4": ""})]) >> Dispatches(nothing),
        ])
        journal.events.handle(VideoToSample, SampleVideoFrames(), expects=[
            Given(VideoToSample(message=5, name="clip.mp4"), rows=[with_files(**{"clip.mp4": ""})], processes=answering({"git": "/usr/bin/git"}))
                >> Updated(Message(n=5), files={"clip.mp4": f"{TAGGED}ffmpeg and ffprobe are required to extract frames"}),
        ])
