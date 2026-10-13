import json
import shutil

from events import Fact
from events.attachment_descriptions import ManyMediaUntagged, MediaAttached, MediaUntagged, VideoToSample
from features.attachment_descriptions.video import TAGGED, frames_of, probe, sampled, spacing
from receiving import Handler
from resources.types import Message
from serving import Chat, Elsewhere, Rows


class TellLiveAgents(Handler[MediaAttached]):
    def handle(self, event: MediaAttached, elsewhere: Elsewhere) -> list[Fact]:
        for chat in elsewhere.here().chats():
            chat.say("untagged", type=event.type, n=event.n, name=event.name, quoted=json.dumps(event.name))
        return []


class TellUntagged(Handler[MediaUntagged]):
    def handle(self, event: MediaUntagged, chat: Chat) -> list[Fact]:
        chat.say("untagged", type=event.type, n=event.n, name=event.name, quoted=json.dumps(event.name))
        return []


class TellManyUntagged(Handler[ManyMediaUntagged]):
    def handle(self, event: ManyMediaUntagged, chat: Chat) -> list[Fact]:
        chat.say("many untagged", count=event.count, listed=event.listed)
        return []


class SampleVideoFrames(Handler[VideoToSample]):
    def handle(self, event: VideoToSample, messages: Rows[Message]) -> list[Fact]:
        name = event.name
        source = messages.folder(event.message) / name
        row = messages.load(event.message)
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            row.files[name] = f"{TAGGED}ffmpeg and ffprobe are required to extract frames"
            messages.save(row, "updated", video=name, frames=[])
            return []
        every = spacing(probe(source))
        for old in frames_of(source):
            old.unlink()
            row.files.pop(old.name, None)
        frames, failure = sampled(source, every)
        why = f"; no frames: {failure}" if failure else ""
        row.files[name] = f"{TAGGED}{len(frames)} frames every {every:g} seconds{why}"
        for frame in frames:
            row.files[frame.name] = f"video frame from {name}"
        messages.save(row, "updated", video=name, frames=[frame.name for frame in frames])
        return []
