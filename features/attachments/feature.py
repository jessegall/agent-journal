import json
import mimetypes

from controllers.types import Agents, CONTROLLERS
from features.base import Feature, event
from resources.base import SYSTEM, titled


class Attachments(Feature):
    name = "attachments"
    title_ = "Attachment tags"
    abstract_ = "Images and videos are described in a few searchable words by the agent"
    help_ = "When a media file needs tags, inspect it and run `journal <type> tag <n> <name> <tags>` with a few words describing what it shows."

    def missing(self, record) -> list[tuple[str, object, str]]:
        return [(type_, row, name) for type_, controller in CONTROLLERS.items()
                for row in controller(record, actor=SYSTEM).all() for name, tags in row.files.items()
                if (not tags or str(tags).startswith("video; ")) and (mimetypes.guess_type(name)[0] or "").startswith(("image/", "video/"))]

    def tell(self, record, agent, type_: str, row, name: str) -> None:
        command = f"journal {type_} tag {row.n} {json.dumps(name)} \"<a few words describing what it shows>\""
        self.nudge(record, agent, titled(f"{type_} {row.n} file {name} needs tags"), f"inspect the attachment, then {command}")

    @event("updated")
    def tag_media(self, event, record) -> None:
        name = str(event.data.get("file") or "")
        kind = mimetypes.guess_type(name)[0] or ""
        if event.type not in CONTROLLERS or not name or not kind.startswith(("image/", "video/")):
            return
        row = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        if row.files.get(name):
            return
        for agent in Agents(record, actor=SYSTEM).all():
            if agent.status and agent.status != "stopped":
                self.tell(record, agent, event.type, row, name)

    @event("agent.updated")
    def at_start(self, event, record) -> None:
        agent = Agents(record, actor=SYSTEM).load(event.n)
        if agent.event == "SessionStart":
            for type_, row, name in self.missing(record):
                self.tell(record, agent, type_, row, name)
