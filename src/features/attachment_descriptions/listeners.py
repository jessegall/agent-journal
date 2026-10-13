import json
import mimetypes

from controllers.base import CONTROLLERS
from events import Fact
from events.agents import SessionStarted
from events.attachment_descriptions import ManyMediaUntagged, MediaAttached, MediaUntagged, VideoToSample
from events.messages import MessageUpdated
from events.resources import FileAttached
from features.attachment_descriptions.video import TAGGED, VIDEO
from receiving import Listener
from resources.base import AGENT
from resources.memo import Memo
from resources.types import Message
from serving import ReadElsewhere, Settings

MEDIA = ("image/", VIDEO)
FEW, LISTED = 3, 10
UNTAGGED = Memo()


def media(name: str, kinds: tuple[str, ...] | str = MEDIA) -> bool:
    return (mimetypes.guess_type(name)[0] or "").startswith(kinds)


def untagged_in(here, type_: str) -> list[tuple[str, int, str]]:
    """The media files of a type that still need tags, found again only when the type's rows have changed."""
    rows = here.rows_named(type_).rows
    return UNTAGGED.get(str(rows.folder()), rows.summaries(),
                        lambda: [(type_, row.n, name) for row in rows.attached() for name, tags in row.files.items() if (not tags or str(tags).startswith(TAGGED)) and media(name)])


class SpotNewMedia(Listener[FileAttached]):
    def listen(self, event: FileAttached, elsewhere: ReadElsewhere, settings: Settings) -> list[Fact]:
        if not settings.is_on("tagging") or event.type not in CONTROLLERS or not event.file or not media(event.file):
            return []
        row = elsewhere.here().rows_named(event.type).peek(event.n)
        if event.file not in row.files or row.files.get(event.file):
            return []
        if event.type == Message.type and AGENT not in row.seen:
            return []
        return [MediaAttached(type=event.type, n=row.n, name=event.file)]


class SpotMissingMedia(Listener[SessionStarted]):
    def listen(self, event: SessionStarted, elsewhere: ReadElsewhere, settings: Settings) -> list[Fact]:
        if not settings.is_on("tagging"):
            return []
        here = elsewhere.here()
        untagged = [found for type_ in CONTROLLERS for found in untagged_in(here, type_)]
        if len(untagged) <= FEW:
            return [MediaUntagged(type=type_, n=n, name=name) for type_, n, name in untagged]
        listed = "; ".join(f"{type_} {n} {json.dumps(name)}" for type_, n, name in untagged[:LISTED])
        return [ManyMediaUntagged(count=len(untagged), listed=listed)]


class SpotVideo(Listener[MessageUpdated]):
    def listen(self, event: MessageUpdated, settings: Settings) -> list[Fact]:
        return [VideoToSample(message=event.n, name=event.file)] if settings.is_on("frames") and event.file and media(event.file, VIDEO) else []
