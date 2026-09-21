import json
import mimetypes
import shutil
import subprocess

from controllers.types import Agents, CONTROLLERS, Messages
from features.attachments.video import MAX_FRAMES, probe, spacing
from features.base import Behaviour, Feature, event, Line
from resources.base import SYSTEM


class Attachments(Feature):
    name = "attachments"
    lines = {"untagged": Line("{{type}} {{n}} file {{name}} needs tags", 'inspect the attachment, then journal {{type}} tag {{n}} {{quoted}} "<a few words describing what it shows>"')}
    title_ = "Attachments"
    abstract_ = "An attached file is read for the agent — a video sampled into frames — and each image or video is described in a few searchable words"
    help_ = ("When a media file needs tags, inspect it and run `journal <type> tag <n> <name> <tags>` with a few words describing what it shows. "
             "A video attached to a message is sampled into frames: short clips every half second, medium clips every two seconds, and long clips at most sixty frames.")
    aliases = (("video", "frames"),)
    behaviours = {
        "tagging": Behaviour("Ask for a description of each image and video", "The agent is told when a media file has no tags yet"),
        "frames": Behaviour("Sample a video into frames", "Needs ffmpeg and ffprobe on the machine"),
    }

    def missing(self, record) -> list[tuple[str, object, str]]:
        return [(type_, row, name) for type_, controller in CONTROLLERS.items()
                for row in controller(record, actor=SYSTEM)._every() for name, tags in row.files.items()
                if (not tags or str(tags).startswith("video; ")) and (mimetypes.guess_type(name)[0] or "").startswith(("image/", "video/"))]

    def tell(self, record, agent, type_: str, row, name: str) -> None:
        self.journal.say(record, agent, "untagged", type=type_, n=row.n, name=name, quoted=json.dumps(name))

    @event("updated")
    def tag_media(self, event, record) -> None:
        name = str(event.data.get("file") or "")
        kind = mimetypes.guess_type(name)[0] or ""
        if not self.on(record, "tagging") or event.type not in CONTROLLERS or not name or not kind.startswith(("image/", "video/")):
            return
        row = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        if name not in row.files or row.files.get(name):
            return
        for agent in Agents(record, actor=SYSTEM)._every():
            if agent.status and agent.status != "stopped":
                self.tell(record, agent, event.type, row, name)

    @event("agent.updated")
    def at_start(self, event, record) -> None:
        agent = Agents(record, actor=SYSTEM).load(event.n)
        if self.on(record, "tagging") and agent.event == "SessionStart":
            for type_, row, name in self.missing(record):
                self.tell(record, agent, type_, row, name)

    @event("message.updated")
    def frames(self, event, record) -> None:
        if not self.on(record, "frames"):
            return
        name = str(event.data.get("file") or "")
        if not name or not (mimetypes.guess_type(name)[0] or "").startswith("video/"):
            return
        messages = Messages(record, actor=SYSTEM)
        source = messages.folder(event.n) / name
        row = messages.load(event.n)
        if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
            row.files[name] = "video; ffmpeg and ffprobe are required to extract frames"
            messages.save(row, "updated", video=name, frames=[])
            return
        seconds = probe(source)
        every = spacing(seconds)
        prefix = f"{source.name.replace('.', '-')}-frame-"
        for old in source.parent.glob(f"{prefix}*.jpg"):
            old.unlink()
            row.files.pop(old.name, None)
        target = source.parent / f"{prefix}%04d.jpg"
        try:
            done = subprocess.run(
                ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source), "-vf", f"fps=1/{every:g}", "-frames:v", str(MAX_FRAMES), "-q:v", "2", str(target)],
                capture_output=True,
                text=True,
                timeout=120,
            )
        except (OSError, subprocess.TimeoutExpired):
            done = None
        frames = sorted(source.parent.glob(f"{prefix}*.jpg")) if done and done.returncode == 0 else []
        row.files[name] = f"video; {len(frames)} frames every {every:g} seconds"
        for frame in frames:
            row.files[frame.name] = f"video frame from {name}"
        messages.save(row, "updated", video=name, frames=[frame.name for frame in frames])
