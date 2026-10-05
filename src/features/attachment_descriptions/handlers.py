import json
import mimetypes
import shutil
from dataclasses import dataclass
from typing import ClassVar

from controllers.types import CONTROLLERS, Agents, Messages
from engine.events.agents import SessionStarted
from engine.events.resources import MessageUpdated, ResourceEvent
from features.attachment_descriptions.video import TAGGED, VIDEO, frames_of, probe, sampled, spacing
from features.parts import AgentContext, Context, Handler
from controllers.types import CONTROLLERS

MEDIA = ("image/", VIDEO)


@dataclass(frozen=True)
class FileAttached(ResourceEvent):
    on: ClassVar[str] = "updated"
    file: str = ""


def media(name: str, kinds: tuple[str, ...] | str = MEDIA) -> bool:
    return (mimetypes.guess_type(name)[0] or "").startswith(kinds)


def tell(context: Context, type_: str, row, name: str) -> None:
    context.agent.say("untagged", type=type_, n=row.n, name=name, quoted=json.dumps(name))


class TagNewMedia(Handler):
    behaviour = "tagging"

    def handle(self, context: Context, event: FileAttached) -> None:
        if event.type not in CONTROLLERS or not event.file or not media(event.file):
            return
        row = context.journal.get(CONTROLLERS[event.type]).load(event.n)
        if event.file not in row.files or row.files.get(event.file):
            return
        for agent in context.journal.get(Agents).rows.every():
            if agent.live:
                tell(context.speaking_to(agent), event.type, row, event.file)


class TagMissingAtStart(Handler):
    behaviour = "tagging"

    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        untagged = ((type_, row, name) for type_ in CONTROLLERS for row in context.journal.get(CONTROLLERS[type_]).rows.every()
                    for name, tags in row.files.items() if (not tags or str(tags).startswith(TAGGED)) and media(name))
        for type_, row, name in untagged:
            tell(context, type_, row, name)


class SampleVideoFrames(Handler):
    behaviour = "frames"

    def handle(self, context: Context, event: MessageUpdated) -> None:
        name = event.file
        if not name or not media(name, VIDEO):
            return
        messages = context.journal.get(Messages)
        source = messages.folder(event.n) / name
        row = messages.load(event.n)
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            row.files[name] = f"{TAGGED}ffmpeg and ffprobe are required to extract frames"
            messages.save(row, "updated", video=name, frames=[])
            return
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
