import json
import mimetypes
import shutil
import subprocess
from dataclasses import dataclass
from typing import ClassVar

from controllers.types import CONTROLLERS
from engine.events import ResourceEvent, SessionStarted
from features.attachment_descriptions.video import MAX_FRAMES, probe, spacing
from features.parts import AgentContext, Context, Handler

MEDIA = ("image/", "video/")


@dataclass(frozen=True)
class FileAttached(ResourceEvent):
    on: ClassVar[str] = "updated"
    file: str = ""


@dataclass(frozen=True)
class MessageFileAttached(FileAttached):
    on: ClassVar[str] = "message.updated"


def media(name: str) -> bool:
    return (mimetypes.guess_type(name)[0] or "").startswith(MEDIA)


def tell(context: Context, type_: str, row, name: str) -> None:
    context.agent.say("untagged", type=type_, n=row.n, name=name, quoted=json.dumps(name))


class TagNewMedia(Handler):
    behaviour = "tagging"

    def handle(self, context: Context, event: FileAttached) -> None:
        if event.type not in CONTROLLERS or not event.file or not media(event.file):
            return
        row = context.journal.of(event.type).load(event.n)
        if event.file not in row.files or row.files.get(event.file):
            return
        for agent in context.journal.agents._every():
            if agent.status and agent.status != "stopped":
                tell(context.speaking_to(agent), event.type, row, event.file)


class TagMissingAtStart(Handler):
    behaviour = "tagging"

    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        untagged = ((type_, row, name) for type_ in CONTROLLERS for row in context.journal.of(type_)._every()
                    for name, tags in row.files.items() if (not tags or str(tags).startswith("video; ")) and media(name))
        for type_, row, name in untagged:
            tell(context, type_, row, name)


class SampleVideoFrames(Handler):
    behaviour = "frames"

    def handle(self, context: Context, event: MessageFileAttached) -> None:
        name = event.file
        if not name or not (mimetypes.guess_type(name)[0] or "").startswith("video/"):
            return
        messages = context.journal.messages
        source = messages.folder(event.n) / name
        row = messages.load(event.n)
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            row.files[name] = "video; ffmpeg and ffprobe are required to extract frames"
            messages.save(row, "updated", video=name, frames=[])
            return
        every = spacing(probe(source))
        prefix = f"{source.name.replace('.', '-')}-frame-"
        for old in source.parent.glob(f"{prefix}*.jpg"):
            old.unlink()
            row.files.pop(old.name, None)
        try:
            done = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source), "-vf", f"fps=1/{every:g}", "-frames:v", str(MAX_FRAMES),
                                   "-q:v", "2", str(source.parent / f"{prefix}%04d.jpg")], capture_output=True, text=True, timeout=120)
        except (OSError, subprocess.TimeoutExpired) as error:
            done = subprocess.CompletedProcess([], -1, "", str(error))
        frames = sorted(source.parent.glob(f"{prefix}*.jpg")) if done.returncode == 0 else []
        errors = (done.stderr or "").strip().splitlines()
        failure = errors[-1] if errors else "ffmpeg failed"
        why = "" if done.returncode == 0 else f"; no frames: {failure}"
        row.files[name] = f"video; {len(frames)} frames every {every:g} seconds{why}"
        for frame in frames:
            row.files[frame.name] = f"video frame from {name}"
        messages.save(row, "updated", video=name, frames=[frame.name for frame in frames])
